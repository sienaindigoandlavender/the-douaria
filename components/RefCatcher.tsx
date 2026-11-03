"use client";

import { useEffect } from "react";

/** Remembers where a visitor came from (?ref=instagram, ?ref=card, or utm_source / Instagram's in-app browser),
 *  so a booking can say so in ops. First touch wins; kept 90 days in this browser. Jacqueline, 1 Nov 2026. */
export const REF_KEY = "rds_ref";

export function readRef(): string {
  try {
    const raw = localStorage.getItem(REF_KEY);
    if (!raw) return "";
    const { v, t } = JSON.parse(raw);
    return Date.now() - t < 90 * 864e5 ? String(v) : "";
  } catch {
    return "";
  }
}

export default function RefCatcher() {
  useEffect(() => {
    try {
      if (readRef()) return;
      const q = new URLSearchParams(location.search);
      let v = q.get("ref") || q.get("utm_source") || "";
      if (!v && /Instagram/i.test(navigator.userAgent)) v = "instagram";
      if (!v && /instagram\.com/i.test(document.referrer)) v = "instagram";
      v = v.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
      if (v) localStorage.setItem(REF_KEY, JSON.stringify({ v, t: Date.now() }));
    } catch {}
  }, []);
  return null;
}
