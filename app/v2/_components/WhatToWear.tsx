"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { details } from "../../../content/details";

// Madhubani-style band (double rule, hatching, fish + triangles), tiled across the card edge.
function MadhubaniBand({ id }: { id: string }) {
  return (
    <svg className="wr-band" aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="28" height="20" patternUnits="userSpaceOnUse">
          <rect width="28" height="20" fill="#ffd60a" />
          <line x1="0" y1="2" x2="28" y2="2" stroke="#2a1a14" strokeWidth="1.4" />
          <line x1="0" y1="18" x2="28" y2="18" stroke="#2a1a14" strokeWidth="1.4" />
          <path d="M3 15 L9 5 L15 15 Z" fill="#2b9348" stroke="#2a1a14" strokeWidth="0.8" />
          <path d="M16 10 Q21 5 25 10 Q21 15 16 10 Z M25 10 L28 7 L28 13 Z" fill="#d90429" stroke="#2a1a14" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// Alpona-style corner: white rice-paste curl with dots.
function AlponaCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg className={`wr-corner wr-corner-${pos}`} viewBox="0 0 60 60" aria-hidden>
      <g stroke="#fff8e7" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M4 56 L4 18 Q4 4 18 4 L56 4" />
        <path d="M12 40 Q12 12 40 12" />
        <path d="M22 30 C22 20 34 20 34 28 C34 34 26 34 27 29" />
      </g>
      <g fill="#fff8e7">
        <circle cx="48" cy="12" r="2" />
        <circle cx="12" cy="48" r="2" />
        <circle cx="20" cy="20" r="1.6" />
      </g>
    </svg>
  );
}

export default function WhatToWear() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".wr-head > *", {
        yPercent: 110,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.utils.toArray<HTMLElement>(".wr-card").forEach((card, i) => {
        gsap.from(card, {
          y: 70,
          rotate: i % 2 ? 4 : -4,
          autoAlpha: 0,
          duration: 0.9,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="wr" ref={root} id="wear" data-wipe>
      <header className="wr-head">
        <h2 className="truck-inline">What to wear</h2>
        <p>Our two cultures, your wardrobe.</p>
      </header>
      <div className="wr-grid">
        {details.wear.map((w, i) => {
          const mb = i % 2 === 0;
          return (
            <article key={w.event} className={`wr-card ${mb ? "wr-mb" : "wr-al"}`}>
              {mb ? (
                <>
                  <MadhubaniBand id={`wr-mb-${i}-t`} />
                  <MadhubaniBand id={`wr-mb-${i}-b`} />
                </>
              ) : (
                (["tl", "tr", "bl", "br"] as const).map((p) => <AlponaCorner key={p} pos={p} />)
              )}
              <h3 className="truck">{w.event}</h3>
              <ul className="wr-swatches" aria-label={`Colours for ${w.event}: ${w.names.join(", ")}`}>
                {w.swatches.map((c) => (
                  <li key={c} style={{ background: c }} />
                ))}
              </ul>
              <p className="wr-names">{w.names.join(" · ")}</p>
              <p className="wr-note">{w.note}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
