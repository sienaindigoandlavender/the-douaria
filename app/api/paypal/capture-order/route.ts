import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";
import { confirmBooking } from "@/lib/booking";

export const dynamic = "force-dynamic";

// Step 2 of checkout: the guest approved in PayPal; the SERVER takes the payment,
// checks it, confirms the booking and sends the emails.
export async function POST(request: Request) {
  try {
    const { orderID } = (await request.json()) as { orderID?: string };
    if (!orderID) return NextResponse.json({ error: "Missing order" }, { status: 400 });

    const cap = await captureOrder(orderID);
    if (cap.status !== "COMPLETED") {
      return NextResponse.json({ success: false, error: `Payment ${cap.status.toLowerCase()}` }, { status: 402 });
    }
    const result = await confirmBooking(cap);
    if (result === "confirmed" || result === "already") {
      return NextResponse.json({ success: true, bookingId: cap.bookingId });
    }
    // Money is in but the record had a problem: say so loudly; the webhook will retry.
    console.error("PAID BUT NOT CONFIRMED:", orderID, result);
    return NextResponse.json({ success: true, bookingId: cap.bookingId, warning: result });
  } catch (e) {
    console.error("capture-order error:", e);
    return NextResponse.json({ success: false, error: "We could not confirm the payment. Please contact us." }, { status: 500 });
  }
}
