/* Sun position for Marrakech, by arithmetic: no API, nothing to go stale.
   Copied from Slow Morocco's lib/solar.ts (21 Oct 2026) for the living home hero. */

const RAD = Math.PI / 180;
const DAY_MS = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;

const toJulian = (d: Date) => d.valueOf() / DAY_MS - 0.5 + J1970;
const toDays = (d: Date) => toJulian(d) - J2000;

const OBLIQUITY = RAD * 23.4397;

const solarMeanAnomaly = (d: number) => RAD * (357.5291 + 0.98560028 * d);

function eclipticLongitude(M: number) {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = RAD * 102.9372; // perihelion of the earth
  return M + C + P + Math.PI;
}

function sunCoords(d: number) {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  return {
    dec: Math.asin(Math.sin(OBLIQUITY) * Math.sin(L)),
    ra: Math.atan2(Math.sin(L) * Math.cos(OBLIQUITY), Math.cos(L)),
  };
}

const siderealTime = (d: number, lw: number) => RAD * (280.16 + 360.9856235 * d) - lw;

/** Altitude of the sun above the horizon, in degrees. Negative after dark. */
export function sunAltitude(date: Date, lat: number, lon: number): number {
  const lw = RAD * -lon;
  const phi = RAD * lat;
  const d = toDays(date);
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  const alt = Math.asin(
    Math.sin(phi) * Math.sin(c.dec) + Math.cos(phi) * Math.cos(c.dec) * Math.cos(H),
  );
  return alt / RAD;
}


/** What the light is doing: below 6° everything turns warm, above 60° there are no shadows. */
export function lightQuality(altitudeDeg: number):
  | "dark" | "twilight" | "golden" | "low" | "high" | "overhead" {
  if (altitudeDeg < -6) return "dark";
  if (altitudeDeg < -0.833) return "twilight";
  if (altitudeDeg < 6) return "golden";
  if (altitudeDeg < 25) return "low";
  if (altitudeDeg < 60) return "high";
  return "overhead";
}
