import { NextResponse } from "next/server";
import { checkCode } from "@/lib/booking";

export const dynamic = "force-dynamic";

// POST { code, itemId } → { code, percent, label } or { error }.
// Lets the booking form show the discount; the real price is set again in create-order.
export async function POST(request: Request) {
  try {
    const { code, itemId } = (await request.json()) as { code?: string; itemId?: string };
    if (!String(code || "").trim()) return NextResponse.json({ error: "Please type the code." }, { status: 400 });
    const r = await checkCode(code, itemId);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
    return NextResponse.json({ code: r.code, percent: r.percent, label: r.label });
  } catch {
    return NextResponse.json({ error: "Couldn't check the code. Please try again." }, { status: 500 });
  }
}
