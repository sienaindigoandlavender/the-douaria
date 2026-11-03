import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const FROM = process.env.MAIL_FROM || "The Douaria <bookings@riaddisiena.com>";
const HOUSE = process.env.HOUSE_EMAIL || "happy@riaddisiena.com";
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }
  if (clip(b.website, 200)) return NextResponse.json({ ok: true }); // the bot field: say thanks, send nothing
  const name = clip(b.name, 120), email = clip(b.email, 200), phone = clip(b.phone, 40), message = clip(b.message, 4000);
  if (!name || !message) return NextResponse.json({ error: "Please add your name and a message." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "Please check your email address." }, { status: 400 });
  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM,
      to: HOUSE,
      replyTo: email,
      subject: `The Douaria: message from ${name}`,
      text: [`From: ${name} <${email}>`, phone ? `WhatsApp: ${phone}` : "", "", message].filter((l, i) => l || i === 2).join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact email failed", e);
    return NextResponse.json({ error: "We couldn't send it just now. Please try again in a minute." }, { status: 500 });
  }
}
