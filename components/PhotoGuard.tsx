"use client";
import { useEffect } from "react";


const MEDIA = "img, picture, video, [data-photo]";

// House rule: photos can't be saved, and no Pinterest pins until a /pin-image route exists.
export default function PhotoGuard() {
  useEffect(() => {
    const stop = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(MEDIA)) e.preventDefault();
    };
    const sign = (img: HTMLImageElement) => {
      const src = img.currentSrc || img.src;
      if (img.dataset.pinSrc === src) return;
      img.dataset.pinSrc = src;
      if (!src || src.startsWith("data:") || /\.svg(\?|$)/i.test(src)) {
        delete img.dataset.pinMedia;
        img.dataset.pinNopin = "true";
        return;
      }
      // No /pin-image here yet: nothing is pinnable until it exists.
      delete img.dataset.pinMedia;
      img.dataset.pinNopin = "true";
    };
    const scan = () => document.querySelectorAll("img").forEach((i) => sign(i as HTMLImageElement));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "srcset"] });
    document.addEventListener("load", scan, true);
    document.addEventListener("contextmenu", stop);
    document.addEventListener("dragstart", stop);
    return () => {
      mo.disconnect();
      document.removeEventListener("load", scan, true);
      document.removeEventListener("contextmenu", stop);
      document.removeEventListener("dragstart", stop);
    };
  }, []);
  return null;
}
