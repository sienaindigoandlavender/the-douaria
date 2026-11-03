import { NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";
import { createHold, expireHolds, quoteWithCode, quotePlain, validate, type BookingInput } from "@/lib/booking";

export const dynamic = "force-dynamic";

// Step 1 of checkout: save the booking as a hold, then open a PayPal order for it.
export async function POST(request: Request) {
  try {
    const b = (await request.json()) as BookingInput;
    const problem = validate(b);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    // A discount code: the server prices the booking itself and charges that, whatever the page said.
    let quote = null;
    if (String(b.code || "").trim()) {
      const q = await quoteWithCode(b);
      if ("error" in q) return NextResponse.json({ error: q.error }, { status: 400 });
      quote = q;
    } else {
      // No code: the server still sets the price (ops prices × nights + city tax).
      const p = await quotePlain(b);
      if ("error" in p) return NextResponse.json({ error: p.error }, { status: 400 });
      b.totalEUR = p.total.toFixed(2);
      b.nights = p.nights;
    }

    await expireHolds().catch(() => 0); // tidy old unpaid holds; never blocks a new booking

    const bookingId = await createHold(b, quote);
    const amount = (quote ? quote.total : parseFloat(String(b.totalEUR))).toFixed(2);
    const description = `${b.itemName} - ${b.checkIn}${b.checkOut ? ` to ${b.checkOut}` : ""}`;
    const orderID = await createOrder({ amount, description, bookingId });
    return NextResponse.json({ orderID, bookingId });
  } catch (e) {
    console.error("create-order error:", e);
    return NextResponse.json({ error: "Could not start the payment. Please try again." }, { status: 500 });
  }
}
