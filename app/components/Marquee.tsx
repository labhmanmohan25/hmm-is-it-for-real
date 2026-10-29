"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

const bandA = [
  "शुभ विवाह (Shubh Vivah)",
  "শুভ বিবাহ (Shubho Bibaho)",
  "Apurva weds Manmohan",
  "Mithila × Bengal",
  "स्वागत अछि (Welcome!)",
  "Shaadi in Aamchi Mumbai",
];
const bandB = [
  "Litti Chokha",
  "Machh-Bhaat",
  "Makhana",
  "Rosogolla",
  "Mishti Doi",
  "Vada Pav",
  "Cutting Chai",
  "Horn OK Please",
  "Ganpati Bappa Morya",
];

function script(text: string) {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "truck";
}

function Band({ items, className }: { items: string[]; className: string }) {
  const row = [...items, ...items, ...items];
  return (
    <div className={`band ${className}`}>
      <div className="band-track">
        {[0, 1].map((copy) => (
          <div className="band-set" key={copy} aria-hidden={copy === 1}>
            {row.map((t, i) => (
              <span key={i} className="band-item">
                {t.includes(" (") ? (
                  <span>
                    <span className={script(t)}>{t.split(" (")[0]}</span>{" "}
                    <small className="band-en">({t.split(" (")[1]}</small>
                  </span>
                ) : (
                  <span className={script(t)}>{t}</span>
                )}
                <i className="band-star">✺</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".band-track");
      const wrap = gsap.utils.wrap(-50, 0);
      const pos = tracks.map(() => 0);
      const base = [-0.045, 0.035];
      const skews = gsap.utils.toArray<HTMLElement>(".band").map((b) =>
        gsap.quickTo(b, "skewX", { duration: 0.6, ease: "power3" }),
      );
      let boost = 0;
      let dir = 1;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 250, 12);
        },
      });

      // Speed up with scroll velocity and flip direction with scroll direction
      const tick = (_: number, dt: number) => {
        boost *= 0.92;
        tracks.forEach((t, i) => {
          pos[i] = wrap(pos[i] + base[i] * dir * (1 + boost) * (dt / 16.7));
          gsap.set(t, { xPercent: pos[i] });
        });
        skews.forEach((s, i) => s((i ? -1 : 1) * dir * Math.min(boost, 8)));
      };
      gsap.ticker.add(tick);

      // The bands burst out of the hero's sindoor dot as the marquee rises into view
      gsap.from(".band", {
        scale: 0.1,
        rotation: (i) => (i ? 30 : -30),
        autoAlpha: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: 0.3 },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <section className="marquee" ref={root} aria-label="Shubh Vivah">
      <Band items={bandA} className="band-a" />
      <Band items={bandB} className="band-b" />
    </section>
  );
}
