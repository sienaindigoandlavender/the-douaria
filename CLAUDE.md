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
- No decorative 01/02/03 numbering: numbers only where order is real (steps, days, ranked lists). Jacqueline, 9 Nov 2026.
- Photos can't be saved (`PhotoGuard`); no pins until a /pin-image route exists.
- ii.riaddisiena.com = this project (Jacqueline, 14 Nov 2026): Booking.com guests' pages (/welcome, /arrival, /keys, /the-riad/*, /the-douaria/*) and the APIs they call are proxied from indigoandlavender.love via `rewrites` in `next.config.js` (beforeFiles; /drawings falls back to it). Its assetPrefix `/il-static` keeps its /_next files apart. noindex comes from the neutral site.
- Footer and menu (Jacqueline, 14 Nov 2026): STAY, EXPERIENCE (ends with Morocco → slowmorocco.com, also in the top menu), LEARN (Derb.so, Darija.io, Amazigh.online, Tsawer), GOOD TO KNOW. The ii footer in indigo-and-lavender (`IIFooter`) mirrors it.

- Voice (Jacqueline, 23 Nov 2026): light, never pompous. No educating, no lecturing, no sermons. House rule for every site.
- ii.riaddisiena.com retired (Jacqueline, 24 Nov 2026): every request on that host redirects (308) to the same path on www.riaddisiena.com, which serves Booking.com guests' pages again. The rewrites below it no longer run for that host.

- The voice is law (Jacqueline, 26 Nov 2026; also in the Oud note "The voice (law)"). I share my knowledge and my love of Morocco with the reader as a friend, never a pompous guide: genuine, here to share the joy and the information that delight. The voice is the Queen of Wands, the Empress, the High Priestess and the Inner Child (not the Fool). Never soften, erase or play small: sovereign, bowing to no one; the content is authority, not asking permission or to be liked. Laughter and fun are part of the joy, never fear and never a way to soften. Authentic and raw, never hurtful, no political correctness or awkwardness; the real, not the shiny and palatable. Call out the bullshit without throwing anyone shade or under the bus. NEVER criticise Morocco in any way, no subtle digs, no religion, no political stance: always on Morocco's side. If a line makes the writer sound like an asshole, it is the wrong energy. House rule for every site.
