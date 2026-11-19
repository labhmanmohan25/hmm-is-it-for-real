"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

// Faceted, Tota-Myna-poster style petals: flat two-tone facets, haldi-yellow outlines.
const Y = "#ffd60a";
const PALETTES = [
  { light: "#5fd068", mid: "#2b9348", dark: "#0f5c2c" },
  { light: "#ff6b3d", mid: "#d90429", dark: "#8d0019" },
  { light: "#ffd60a", mid: "#ff8c1a", dark: "#e05a00" },
];
type Pal = (typeof PALETTES)[number];

function Kite({ p }: { p: Pal }) {
  return (
    <svg viewBox="-10 -16 20 32">
      <polygon points="0,-14 -8,-2 0,-2" fill={p.light} />
      <polygon points="-8,-2 0,14 0,-2" fill={p.mid} />
      <polygon points="0,-14 8,-2 0,-2" fill={p.mid} />
      <polygon points="8,-2 0,14 0,-2" fill={p.dark} />
      <line x1="0" y1="-14" x2="0" y2="14" stroke={Y} strokeWidth="0.8" />
      <polygon points="0,-14 -8,-2 0,14 8,-2" fill="none" stroke={Y} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="0" cy="-2" r="1.5" fill={Y} />
    </svg>
  );
}

function Leaf({ p }: { p: Pal }) {
  return (
    <svg viewBox="-10 -20 20 40">
      <polygon points="0,-18 -6,-9 0,-9" fill={p.light} />
      <polygon points="-6,-9 -9,3 0,3 0,-9" fill={p.mid} />
      <polygon points="-9,3 -5,12 0,12 0,3" fill={p.light} />
      <polygon points="-5,12 0,19 0,12" fill={p.mid} />
      <polygon points="0,-18 6,-9 0,-9" fill={p.mid} />
      <polygon points="6,-9 9,3 0,3 0,-9" fill={p.dark} />
      <polygon points="9,3 5,12 0,12 0,3" fill={p.mid} />
      <polygon points="5,12 0,19 0,12" fill={p.dark} />
      <line x1="0" y1="-14" x2="0" y2="18" stroke={Y} strokeWidth="0.8" />
      <polygon points="-2,-4 2,-4 0,-1" fill={Y} />
      <polygon points="-2,4 2,4 0,7" fill={Y} />
      <polygon
        points="0,-18 -6,-9 -9,3 -5,12 0,19 5,12 9,3 6,-9"
        fill="none"
        stroke={Y}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Rosette() {
  return (
    <svg viewBox="-16 -16 32 32">
      {Array.from({ length: 8 }, (_, i) => (
        <polygon
          key={i}
          points="0,-15 4,-7 -4,-7"
          fill={i % 2 ? "#ff8c1a" : "#d90429"}
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle r="7.5" fill={Y} />
      <circle r="5" fill="#d90429" />
      <circle r="2.2" fill="#5fd068" />
    </svg>
  );
}

function Shard({ p }: { p: Pal }) {
  return (
    <svg viewBox="-8 -8 16 16">
      <polygon points="0,-7 7,6 0,6" fill={p.dark} />
      <polygon points="0,-7 -7,6 0,6" fill={p.light} />
    </svg>
  );
}

// Seeded so server and client render the same field (no hydration mismatch).
let seed = 7;
const rand = (min: number, max: number) => {
  seed = (seed * 16807) % 2147483647;
  return min + ((seed - 1) / 2147483646) * (max - min);
};
const PIECES = Array.from({ length: 26 }, (_, i) => ({
  kind: i % 6 === 0 ? "rosette" : i % 3 === 0 ? "shard" : i % 2 ? "leaf" : "kite",
  pal: PALETTES[i % PALETTES.length],
  left: rand(0, 100),
  size: rand(20, 40),
}));

export default function GeoPetals({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const h = root.current!.offsetHeight;
      gsap.utils.toArray<HTMLElement>(".geo-petal").forEach((el) => {
        const duration = gsap.utils.random(8, 15);
        // Negative delay pre-fills the sky so petals are mid-fall on first paint
        gsap.fromTo(
          el,
          { y: -60 },
          { y: h + 60, duration, ease: "none", repeat: -1, delay: -gsap.utils.random(0, duration) },
        );
        gsap.to(el, {
          x: gsap.utils.random(-70, 70),
          duration: gsap.utils.random(2, 4),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.fromTo(
          el.firstElementChild,
          { rotate: gsap.utils.random(-180, 180), rotateY: 0 },
          {
            rotate: `+=${gsap.utils.random(-360, 360)}`,
            rotateY: 360,
            duration: gsap.utils.random(3, 6),
            ease: "none",
            repeat: -1,
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div className={className} ref={root} aria-hidden>
      {PIECES.map((p, i) => (
        <div key={i} className="geo-petal" style={{ left: `${p.left}%`, width: p.size }}>
          {p.kind === "kite" ? (
            <Kite p={p.pal} />
          ) : p.kind === "leaf" ? (
            <Leaf p={p.pal} />
          ) : p.kind === "rosette" ? (
            <Rosette />
          ) : (
            <Shard p={p.pal} />
          )}
        </div>
      ))}
    </div>
  );
}
