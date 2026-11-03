# The Douaria (thedouaria.com) — notes for Claude

Jacqueline's house at 35 Derb Fhal Zefriti (owned by her). Its own site, not linked to riaddisiena.com on any page (3 Nov 2026, after No. 37's owner asked for her house back).

- Sold four ways (`lib/stays.ts`): the whole house (up to 6, children 8+), Love (ground floor), Joy and Bliss (first floor). Prices come from ops (`house_terms.douaria`, ops /prices); never hard-code a price.
- Booking engine copied from riaddisiena.com: availability (`/api/availability`, Booking + Airbnb iCal + master_guests, room ↔ whole house), house calendar modal, PayPal. The server prices every booking (`quotePlain` / `quoteWithCode` in `lib/booking.ts`). Booking ids start `TD-`, property "The Douaria"; the riad's webhook ignores them, ours (`/api/paypal/webhook`) handles only TD-.
- Shares the riad Supabase (master_guests, douaria_rooms, settings) and PayPal account. Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, (PAYPAL_WEBHOOK_ID), RESEND_API_KEY, MAIL_FROM, NEXT_PUBLIC_SITE_URL.
- Emails (`lib/email.ts`) are Douaria-branded; MAIL_FROM falls back to bookings@riaddisiena.com until thedouaria.com is verified in Resend.
- Look: white plaster, ink, the rooms' wool colours (madder, saffron, undyed grey) and the cobalt of Rhonda's paintings. DM Serif Display + Manrope, bundled (@fontsource).
- Photos in `public/photos` are Jacqueline's own; still missing: courtyard, roof terrace, library (in Drive, HEIC).

## House rules (every site)
- Text is never light grey: ink at full strength; smaller, never paler.
- Square corners everywhere; only true circles stay round.
- Forms: single underline fields, transparent.
- Dates with the house calendar (`components/DatePicker.tsx`), never a browser date input.
- No visible scrollbars.
- Photos can't be saved (`PhotoGuard`); no pins until a /pin-image route exists.
