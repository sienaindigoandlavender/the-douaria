"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Loads the map only when it scrolls near, so the page stays light.
const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false });

export default function HouseMap({ className = "h-[420px] md:h-[520px]" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin: "400px" });
    io.observe(ref.current);
    const t = setTimeout(() => setShow(true), 2500); // background tabs never fire the observer
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return (
    <div ref={ref} className={`relative w-full bg-lime ${className}`} aria-label="Map of the Douaria and Jemaa el-Fna">
      {show && <MapCanvas />}
    </div>
  );
}
