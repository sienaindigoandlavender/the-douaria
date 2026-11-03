// Shared iCal fetching and parsing.
// Used by /api/availability (server-side merge of all channels) and /api/ical.

export interface BookedRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  summary?: string;
}

/**
 * Fetch an iCal feed URL and parse its VEVENTs into booked date ranges.
 * Never throws — returns an empty array on any failure, with the error string.
 */
export async function fetchAndParseIcal(
  url: string
): Promise<{ bookedDates: BookedRange[]; error: string | null }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/calendar, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return { bookedDates: [], error: `Fetch failed: ${response.status} ${response.statusText}` };
    }

    const icalData = await response.text();
    if (!icalData.includes("BEGIN:VCALENDAR")) {
      return { bookedDates: [], error: "Invalid iCal format" };
    }

    const bookedDates: BookedRange[] = [];
    const lines = icalData.split(/\r?\n/);
    let inEvent = false;
    let startDate = "";
    let endDate = "";
    let summary = "";

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Handle line continuations (folded lines start with space/tab)
      while (i + 1 < lines.length && (lines[i + 1].startsWith(" ") || lines[i + 1].startsWith("\t"))) {
        i++;
        line += lines[i].trim();
      }

      if (line === "BEGIN:VEVENT") {
        inEvent = true;
        startDate = "";
        endDate = "";
        summary = "";
      } else if (line === "END:VEVENT") {
        if (startDate) {
          if (!endDate) {
            // No end date → assume 1-night booking. Add a day, timezone-safe.
            const [y, m, d] = startDate.split("-").map(Number);
            const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
            endDate = nextDay.toISOString().split("T")[0];
          }
          bookedDates.push({ start: startDate, end: endDate, summary });
        }
        inEvent = false;
      } else if (inEvent) {
        if (line.startsWith("DTSTART")) {
          const match = line.match(/(\d{4})(\d{2})(\d{2})/);
          if (match) startDate = `${match[1]}-${match[2]}-${match[3]}`;
        } else if (line.startsWith("DTEND")) {
          const match = line.match(/(\d{4})(\d{2})(\d{2})/);
          if (match) endDate = `${match[1]}-${match[2]}-${match[3]}`;
        } else if (line.startsWith("SUMMARY")) {
          summary = line.replace(/^SUMMARY:?/, "").trim();
        }
      }
    }

    return { bookedDates, error: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { bookedDates: [], error: msg };
  }
}
