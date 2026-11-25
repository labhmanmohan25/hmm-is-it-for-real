"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

function script(text: string) {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "truck";
}

function Item({ t }: { t: string }) {
  if (!t.includes(" (")) return <span className={script(t)}>{t}</span>;
  const [main, gloss] = t.split(" (");
  return (
    <span>
      <span className={script(main)}>{main}</span> <small className="nt-en">({gloss}</small>
    </span>
  );
}

type Tone = "sindoor" | "rani" | "lime";

// A TV-news lower third that sits on the seam between two sections. The headlines crawl, speed up
// with scroll velocity and run backwards when you scroll back up.
export default function NewsTicker({ label, items, tone = "sindoor", speed = 0.012 }: { label: string; items: string[]; tone?: Tone; speed?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".nt-track")!;
      const wrap = gsap.utils.wrap(-50, 0);
      let pos = 0;
      let boost = 0;
      let dir = 1;
      let visible = false;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 300, 10);
        },
      });
      const tick = (_: number, dt: number) => {
        if (!visible) return;
        boost *= 0.92;
        pos = wrap(pos - speed * dir * (1 + boost) * (dt / 16.7));
        gsap.set(track, { xPercent: pos });
      };
      gsap.ticker.add(tick);

      // the strip slams in from the side as it reaches the screen
      gsap.from(root.current, {
        xPercent: -100,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 70%", scrub: 0.4 },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root },
  );

  const row = [...items, ...items, ...items];
  return (
    <div className={`nt nt-${tone}`} ref={root} role="marquee" aria-label={`${label}: ${items.join(", ")}`}>
      <div className="nt-bug">
        <span className="nt-live">
          <i aria-hidden />
          LIVE
        </span>
        <b className="truck">{label}</b>
      </div>
      <div className="nt-rail" aria-hidden>
        <div className="nt-track">
          {[0, 1].map((copy) => (
            <div className="nt-set" key={copy}>
              {row.map((t, i) => (
                <span key={i} className="nt-item">
                  <Item t={t} />
                  <i className="nt-star">✺</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="nt-chan truck" aria-hidden>
        Shaadi
        <br />
        24×7
      </div>
    </div>
  );
}
