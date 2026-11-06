# The Douaria (thedouaria.com) — notes for Claude

Jacqueline's house at 35 Derb Fhal Zefriti (owned by her). Its own site, not linked to riaddisiena.com on any page (3 Nov 2026, after No. 37's owner asked for her house back).

- The house is sold as one (Jacqueline, 3 Nov 2026): the whole house leads, up to 6, children 8+; Love, Joy and Bliss are shown as the rooms inside and their pages book the house. Rooms alone still sell on Booking/Airbnb as the safety net (`lib/stays.ts`). Prices come from ops (`house_terms.douaria`, ops /prices); never hard-code a price.
- Booking engine copied from riaddisiena.com: availability (`/api/availability`, Booking + Airbnb iCal + master_guests, room ↔ whole house), house calendar modal, PayPal. The server prices every booking (`quotePlain` / `quoteWithCode` in `lib/booking.ts`). Booking ids start `TD-`, property "The Douaria"; the riad's webhook ignores them, ours (`/api/paypal/webhook`) handles only TD-.
- Shares the riad Supabase (master_guests, douaria_rooms, settings) and PayPal account. Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, (PAYPAL_WEBHOOK_ID), RESEND_API_KEY, MAIL_FROM, NEXT_PUBLIC_SITE_URL.
- Emails (`lib/email.ts`) are Douaria-branded; MAIL_FROM falls back to bookings@riaddisiena.com until thedouaria.com is verified in Resend.
- Look (Jacqueline, 6 Nov 2026): Riad di Siena's design, duplicated: limewash/tadelakt/straw/bejmat/night, the door-yellow button (`.btn-door`), Fraunces (`.house`) + Playfair + EB Garamond, burger header with the stacked name, three-level sand footer, `HouseHero` full-screen photos, `Walk`, `QuoteCarousel`. Only the rooms (`/rooms`, Love/Joy/Bliss + the whole house from `lib/stays.ts`) and the hero photo differ. `/stay` redirects to `/rooms`. Old token names (plaster, cobalt…) map to the riad colours in `tailwind.config.ts`.
- Photos in `public/photos` are Jacqueline's own; still missing: courtyard, roof terrace, library (in Drive, HEIC).

## House rules (every site)
- Text is never light grey: ink at full strength; smaller, never paler.
- Square corners everywhere; only true circles stay round.
- Forms: single underline fields, transparent.
- Dates with the house calendar (`components/DatePicker.tsx`), never a browser date input.
- No visible scrollbars.
- Photos can't be saved (`PhotoGuard`); no pins until a /pin-image route exists.
