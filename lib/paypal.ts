// PayPal, server side. The browser never decides that a booking is paid:
// the server creates the order, captures it, and checks what PayPal says.
// Env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID (live).

const API = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal keys missing (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)");
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const json = await res.json();
  return json.access_token as string;
}

async function call(path: string, init: RequestInit = {}) {
  const token = await accessToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { ok: res.ok, status: res.status, json };
}

/** Create an order. custom_id carries our booking_id so PayPal can always tell us which booking it was. */
export async function createOrder(input: { amount: string; description: string; bookingId: string }) {
  const r = await call("/v2/checkout/orders", {
    method: "POST",
    headers: { "PayPal-Request-Id": `create-${input.bookingId}` },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.bookingId,
          custom_id: input.bookingId,
          description: input.description.slice(0, 127),
          amount: { currency_code: "EUR", value: input.amount },
        },
      ],
    }),
  });
  if (!r.ok) throw new Error(`PayPal create order failed: ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  return r.json.id as string;
}

export interface CaptureInfo {
  status: string; // capture status, "COMPLETED" when the money is in
  captureId: string | null;
  bookingId: string | null; // from custom_id
  amount: number | null;
  currency: string | null;
  payerEmail: string | null;
}

function readCapture(order: any): CaptureInfo {
  const unit = order?.purchase_units?.[0];
  const cap = unit?.payments?.captures?.[0];
  return {
    status: cap?.status || order?.status || "UNKNOWN",
    captureId: cap?.id || null,
    bookingId: unit?.custom_id || cap?.custom_id || unit?.reference_id || null,
    amount: cap?.amount?.value ? parseFloat(cap.amount.value) : null,
    currency: cap?.amount?.currency_code || null,
    payerEmail: order?.payer?.email_address || null,
  };
}

/** Capture an approved order. Safe to call twice: an already-captured order is read back instead. */
export async function captureOrder(orderId: string): Promise<CaptureInfo> {
  const r = await call(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: { "PayPal-Request-Id": `capture-${orderId}` },
  });
  if (r.ok) return readCapture(r.json);
  if (r.json?.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED") return getOrder(orderId);
  throw new Error(`PayPal capture failed: ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
}

export async function getOrder(orderId: string): Promise<CaptureInfo> {
  const r = await call(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);
  if (!r.ok) throw new Error(`PayPal get order failed: ${r.status}`);
  return readCapture(r.json);
}

/** City tax order (Jacqueline, 27 Oct 2026): the guest approves on PayPal and comes back to return_url,
 *  where the server captures it and marks the tax paid. custom_id "TAX:<booking id>" (the webhook ignores it). */
export async function createTaxOrder(input: { amount: string; bookingId: string; returnUrl: string; cancelUrl: string }) {
  const r = await call("/v2/checkout/orders", {
    method: "POST",
    headers: { "PayPal-Request-Id": `tax-${input.bookingId}-${input.amount}-${Date.now()}` },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ reference_id: `TAX:${input.bookingId}`, custom_id: `TAX:${input.bookingId}`, description: `City tax, The Douaria, booking ${input.bookingId}`.slice(0, 127), amount: { currency_code: "EUR", value: input.amount } }],
      application_context: { brand_name: "The Douaria", user_action: "PAY_NOW", shipping_preference: "NO_SHIPPING", return_url: input.returnUrl, cancel_url: input.cancelUrl },
    }),
  });
  if (!r.ok) throw new Error(`PayPal create tax order failed: ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  const approve = (r.json.links || []).find((l: { rel: string; href: string }) => l.rel === "approve" || l.rel === "payer-action")?.href as string | undefined;
  if (!approve) throw new Error("PayPal gave no approval link");
  return { id: r.json.id as string, approve };
}

/** Ask PayPal whether a webhook really came from PayPal. */
export async function verifyWebhook(headers: Headers, event: unknown): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;
  const r = await call("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: event,
    }),
  });
  return r.ok && r.json?.verification_status === "SUCCESS";
}
