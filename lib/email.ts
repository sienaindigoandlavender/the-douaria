import { Resend } from "resend";

// The Douaria's two booking emails: the guest's confirmation and the house's notice.
// Sender: MAIL_FROM (a Resend-verified address). Until thedouaria.com is verified in
// Resend, the default sends from the verified riaddisiena.com domain.

let client: Resend | null = null;
const send = (...args: Parameters<Resend["emails"]["send"]>) => {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client.emails.send(...args);
};

const FROM = process.env.MAIL_FROM || "The Douaria <bookings@riaddisiena.com>";
const HOUSE = process.env.HOUSE_EMAIL || "happy@riaddisiena.com";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thedouaria.com";

export interface BookingEmailData {
  bookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  property: string;
  room?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  paypalOrderId?: string;
  message?: string;
  code?: string;
  discount?: number;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function longDate(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DAYS[dt.getUTCDay()]} ${d} ${MONTHS[m - 1]} ${y}`;
}

const esc = (s: string) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const stayName = (room?: string) => (/whole house/i.test(room || "") ? "the whole house" : room || "your room");

export async function sendGuestConfirmationEmail(d: BookingEmailData) {
  const ink = "#16150f";
  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #e4e1da;font-size:13px;color:${ink};width:38%;">${k}</td><td style="padding:10px 0;border-bottom:1px solid #e4e1da;font-size:15px;color:${ink};">${v}</td></tr>`;
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#f7f5f0;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:Georgia,'Times New Roman',serif;color:${ink};">
  <p style="font-size:28px;margin:0 0 28px;letter-spacing:0.02em;">The Douaria</p>
  <p style="font-size:17px;line-height:1.6;margin:0 0 16px;">Dear ${esc(d.firstName)},</p>
  <p style="font-size:17px;line-height:1.6;margin:0 0 16px;">Your stay is confirmed. ${esc(stayName(d.room))[0].toUpperCase() + esc(stayName(d.room)).slice(1)} is yours from ${longDate(d.checkIn)}.</p>
  <p style="font-size:17px;line-height:1.6;margin:0 0 24px;">Zahra will write to you on WhatsApp a few days before you arrive, with the way through the Medina and the door. Check-in is from 3 PM to 9 PM. Breakfast is included every morning.</p>
  <table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
    ${row("Booking", esc(d.bookingId))}
    ${row("Stay", esc(d.room || ""))}
    ${row("Arrive", longDate(d.checkIn))}
    ${row("Leave", longDate(d.checkOut))}
    ${row("Nights", String(d.nights))}
    ${row("Guests", String(d.guests))}
    ${d.code && d.discount ? row("Code", `${esc(d.code)}: −€${d.discount.toFixed(2)}`) : ""}
    ${row("Paid", `€${d.total.toFixed(2)}`)}
  </table>
  <p style="font-size:15px;line-height:1.6;margin:28px 0 8px;font-family:Arial,Helvetica,sans-serif;">The address: 35 Derb Fhal Zefriti, Laksour, Medina, Marrakech. Taxis can't reach the door, so we'll guide you from the nearest street.</p>
  <p style="font-size:15px;line-height:1.6;margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;">Please read <a href="${SITE}/before-you-book" style="color:${ink};">Before you book</a> and the <a href="${SITE}/booking-conditions" style="color:${ink};">booking conditions</a> if you haven't yet.</p>
  <p style="font-size:17px;line-height:1.6;margin:0;">See you soon,<br>Jacqueline and Zahra</p>
</div></body></html>`;
  try {
    return { success: true, result: await send({ from: FROM, to: d.email, bcc: HOUSE, replyTo: HOUSE, subject: `The Douaria: your stay is confirmed (${d.bookingId})`, html }) };
  } catch (error) {
    console.error("Guest email failed:", error);
    return { success: false, error };
  }
}

export async function sendOwnerNotificationEmail(d: BookingEmailData) {
  const lines = [
    `${d.firstName} ${d.lastName} booked ${d.room} (The Douaria).`,
    `Booking: ${d.bookingId}`,
    `Arrive: ${longDate(d.checkIn)}`,
    `Leave: ${longDate(d.checkOut)} (${d.nights} nights, ${d.guests} guests)`,
    `Paid: €${d.total.toFixed(2)}${d.code ? ` (code ${d.code}, −€${(d.discount || 0).toFixed(2)})` : ""}`,
    `Email: ${d.email}`,
    d.phone ? `WhatsApp: ${d.phone}` : "",
    d.paypalOrderId ? `PayPal: ${d.paypalOrderId}` : "",
    d.message ? `Message: ${d.message}` : "",
    "",
    "Ops: https://ops.riaddisiena.com/team",
  ].filter((l) => l !== "" || true);
  try {
    return {
      success: true,
      result: await send({
        from: FROM,
        to: HOUSE,
        subject: `New booking, The Douaria: ${d.firstName} ${d.lastName}, €${d.total.toFixed(2)}, ${d.room}`,
        text: lines.join("\n"),
      }),
    };
  } catch (error) {
    console.error("House email failed:", error);
    return { success: false, error };
  }
}

export async function sendBookingEmails(d: BookingEmailData) {
  const [guest, owner] = await Promise.all([sendGuestConfirmationEmail(d), sendOwnerNotificationEmail(d)]);
  return { guest, owner };
}
