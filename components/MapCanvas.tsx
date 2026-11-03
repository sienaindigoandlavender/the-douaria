"use client";

// MapLibre on OpenFreeMap's Positron tiles: free OpenStreetMap vector tiles, no key, no account.
// Tinted to the house: plaster land, pale water, ink labels; the house in cobalt, the
// places around it as small ink dots. The OpenStreetMap credit stays visible (licence).

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { HOUSE, NEARBY } from "@/lib/places";

const STYLE = "https://tiles.openfreemap.org/styles/positron";
const PLASTER = "#FBFAF7", INK = "#16150F", COBALT = "#25348C", WATER = "#DCE3E8";

function tint(map: maplibregl.Map) {
  for (const l of map.getStyle().layers || []) {
    try {
      if (l.type === "background") map.setPaintProperty(l.id, "background-color", PLASTER);
      else if (l.type === "fill" && /water/.test(l.id)) map.setPaintProperty(l.id, "fill-color", WATER);
      else if (l.type === "symbol") {
        map.setPaintProperty(l.id, "text-color", INK);
        map.setPaintProperty(l.id, "text-halo-color", PLASTER);
      }
    } catch {}
  }
}

function marker(label: string, sub: string | null, colour: string, big: boolean) {
  const el = document.createElement("div");
  el.className = "td-mark";
  const c = document.createElement("span");
  c.className = "td-dot rounded-full";
  c.style.background = colour;
  c.style.width = c.style.height = big ? "18px" : "10px";
  el.appendChild(c);
  const t = document.createElement("span");
  t.className = big ? "td-tag td-tag-big" : "td-tag";
  t.textContent = sub ? `${label} · ${sub}` : label;
  el.appendChild(t);
  return el;
}

export default function MapCanvas({ zoom = 15.6 }: { zoom?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      bounds: NEARBY.reduce((b, p) => b.extend(p.at), new maplibregl.LngLatBounds(HOUSE, HOUSE)),
      fitBoundsOptions: { padding: { top: 90, bottom: 50, left: 40, right: 200 }, maxZoom: zoom },
      cooperativeGestures: true,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.touchZoomRotate.disableRotation();
    map.on("style.load", () => tint(map));
    const ms = [
      new maplibregl.Marker({ element: marker("The Douaria", null, COBALT, true), anchor: "left", offset: [-9, 0] }).setLngLat(HOUSE).addTo(map),
      ...NEARBY.map((p) => new maplibregl.Marker({ element: marker(p.name, p.walk.replace("about ", ""), INK, false), anchor: "left", offset: [-5, 0] }).setLngLat(p.at).addTo(map)),
    ];
    return () => { ms.forEach((m) => m.remove()); map.remove(); };
  }, [zoom]);
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
