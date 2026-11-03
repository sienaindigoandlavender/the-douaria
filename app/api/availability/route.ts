import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { fetchAndParseIcal, BookedRange } from "@/lib/ical";
import { expireHolds } from "@/lib/booking";

// The Douaria is sold four ways (Jacqueline, 28 Oct 2026): the whole house, or Bliss, Joy, Love
// on their own. A whole-house stay blocks every room; a room stay blocks the whole house.
const DOUARIA_WHOLE_HOUSE = "The Douaria — whole house";
const DOUARIA_PARTS = ["Bliss", "Joy", "Love"];
const related = (room: string): string[] =>
  room === DOUARIA_WHOLE_HOUSE ? [DOUARIA_WHOLE_HOUSE, ...DOUARIA_PARTS] : DOUARIA_PARTS.includes(room) ? [room, DOUARIA_WHOLE_HOUSE] : [room];

export const revalidate = 0;
export const dynamic = "force-dynamic";

/**
 * Single source of truth for a room's availability.
 * Merges every channel that can block a date:
 *   1. Booking.com iCal feed   (rooms.ical_url / douaria_rooms.ical_url)
 *   2. Airbnb iCal feed        (rooms.ical_url_airbnb / douaria_rooms.ical_url_airbnb)
 *   3. Direct website bookings (master_guests)
 * Returns one deduplicated list of booked ranges.
 */
export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get("room") || "";
  // Server key: availability must never depend on public read rules.
  const supabase = getServiceClient();

  const allRanges: BookedRange[] = [];

  // Unpaid checkout holds older than an hour stop blocking dates.
  await expireHolds().catch(() => 0);

  try {
    // 1 & 2. Look up the OTA feed URLs (both tables, by name, plus settings rows
    // airbnb_ical:<room> / booking_ical:<room> kept by ops) for this room and every
    // room it shares nights with (The Douaria: whole house ↔ Bliss, Joy, Love).
    if (room) {
      const names = related(room);
      const [riadRes, douariaRes, extraRes] = await Promise.all([
        supabase.from("rooms").select("name, ical_url, ical_url_airbnb").in("name", names),
        supabase.from("douaria_rooms").select("name, ical_url, ical_url_airbnb").in("name", names),
        supabase.from("settings").select("key, value").in("key", names.flatMap((n) => [`airbnb_ical:${n}`, `booking_ical:${n}`])),
      ]);

      // A neighbour's Airbnb "Not available" blocks are echoes of what that listing imports
      // (often our own feeds), not stays: only its real reservations may block this room (28 Oct 2026).
      const feeds: { url: string; neighbourAirbnb: boolean }[] = [];
      for (const r of [...(riadRes.data || []), ...(douariaRes.data || [])]) {
        const own = r.name === room;
        if (r.ical_url) feeds.push({ url: r.ical_url, neighbourAirbnb: false });
        if (r.ical_url_airbnb) feeds.push({ url: r.ical_url_airbnb, neighbourAirbnb: !own });
      }
      for (const e of extraRes.data || []) {
        if (!e.value) continue;
        const isAirbnb = String(e.key).startsWith("airbnb_ical:");
        const own = String(e.key).endsWith(`:${room}`);
        feeds.push({ url: e.value, neighbourAirbnb: isAirbnb && !own });
      }

      const feedResults = await Promise.all(feeds.map((f) => fetchAndParseIcal(f.url)));
      feedResults.forEach((r, i) => {
        const list = feeds[i].neighbourAirbnb ? r.bookedDates.filter((b) => !/not available/i.test(b.summary || "")) : r.bookedDates;
        allRanges.push(...list);
      });
    }

    // 3. Direct website bookings + manual blocks from master_guests.
    // On the PUBLIC website, a "blocked" date must be UNAVAILABLE (no one can
    // book it). Only truly cancelled bookings are excluded.
    const today = new Date().toISOString().split("T")[0];
    let query = supabase
      .from("master_guests")
      .select("check_in, check_out, room")
      .gte("check_out", today)
      .not("status", "in", '("cancelled")');
    // A reservation can hold two rooms ("Love / Trésor Caché"): match each part.
    const names = room ? related(room) : [];
    if (room) query = query.or(names.map((n) => `room.ilike.%${(n === DOUARIA_WHOLE_HOUSE ? "whole house" : n).replace(/[%_,()]/g, "")}%`).join(","));

    const { data: directData, error: directError } = await query;
    if (directError) {
      console.error("Availability direct-booking query error:", directError.message);
    } else {
      const forRoom = (directData || []).filter(
        (b) => !room || String(b.room || "").split("/").map((r: string) => r.trim()).some((r: string) => names.includes(r)),
      );
      for (const b of forRoom) {
        if (b.check_in && b.check_out) {
          allRanges.push({ start: b.check_in, end: b.check_out, summary: `Direct - ${b.room || ""}` });
        }
      }
    }

    const seen = new Set<string>();
    const bookedDates = allRanges.filter((r) => {
      const key = `${r.start}|${r.end}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ bookedDates });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json({ bookedDates: allRanges });
  }
}
