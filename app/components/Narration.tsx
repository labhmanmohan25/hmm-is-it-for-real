"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";

type Prop = { art: ArtName; mode: "fly" | "rain"; count?: number; side?: "left" | "right" };

// Movie-trailer narrator card: words light up as you scroll past, and food props
// (litti chokha, rosogolla, makhana…) crash the scene.
export default function Narration({
  children,
  aside,
  tone = "dark",
  props = [],
}: {
  children: string;
  aside?: string;
  tone?: "dark" | "haldi" | "ivory" | "sindoor";
  props?: Prop[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".nr-line", { type: "words", wordsClass: "nr-w" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.6 },
      });
      tl.fromTo(split.words, { opacity: 0.1, y: 18, rotate: () => gsap.utils.random(-6, 6) }, { opacity: 1, y: 0, rotate: 0, stagger: 0.08, ease: "none" }, 0);

      gsap.utils.toArray<HTMLElement>(".nr-fly").forEach((el) => {
        const fromLeft = el.dataset.side !== "right";
        tl.fromTo(
          el,
          { x: fromLeft ? "-70vw" : "70vw", rotate: fromLeft ? -540 : 540, scale: 0.4 },
          { x: 0, rotate: fromLeft ? -12 : 12, scale: 1, ease: "back.out(1.4)", duration: 0.6 },
          0,
        );
      });
      gsap.utils.toArray<HTMLElement>(".nr-rain").forEach((el, i) => {
        tl.fromTo(
          el,
          { y: "-60vh", rotate: gsap.utils.random(-200, 200), autoAlpha: 0 },
          { y: `${gsap.utils.random(10, 40)}vh`, rotate: gsap.utils.random(-30, 30), autoAlpha: 1, ease: "bounce.out", duration: 0.7 },
          i * 0.07,
        );
      });

      gsap.from(".nr-mic", {
        rotate: -30,
        scale: 0,
        ease: "back.out(3)",
        duration: 0.8,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section className={`nr nr-${tone}`} ref={root} data-wipe>
      {props.map((p, pi) =>
        p.mode === "fly" ? (
          <div className={`nr-prop nr-fly nr-${p.side ?? "left"}`} data-side={p.side} data-jelly key={pi} aria-hidden>
            <Image {...art(p.art)} alt="" sizes="260px" />
          </div>
        ) : (
          Array.from({ length: p.count ?? 6 }, (_, i) => (
            <div
              className="nr-prop nr-rain"
              key={`${pi}-${i}`}
              style={{ left: `${4 + ((i * 89) % 92)}%`, width: `${70 + ((i * 37) % 60)}px` }}
              aria-hidden
            >
              <Image {...art(p.art)} alt="" sizes="130px" />
            </div>
          ))
        ),
      )}
      <span className="nr-mic truck">🎙 Narrator</span>
      <p className="nr-line">{children}</p>
      {aside && <p className="nr-aside">{aside}</p>}
    </section>
  );
}
