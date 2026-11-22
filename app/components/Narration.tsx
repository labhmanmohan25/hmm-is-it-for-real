"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";

// fly: spins in from its side and lands at `top`% down the card, `off`vw in from the edge, max `w`px wide.
// rain: `count` copies drop from the top and bounce.
type Prop = {
  art: ArtName;
  mode: "fly" | "rain";
  count?: number;
  side?: "left" | "right";
  top?: number;
  w?: number;
  off?: number;
  round?: boolean;
};

// Movie-trailer narrator card: words slam in as you scroll past, food props crash the scene and
// then keep dancing. `show` makes it a full-screen card with spinning rays and twinkling sparkles.
export default function Narration({
  children,
  aside,
  tone = "dark",
  props = [],
  show = false,
}: {
  children: string;
  aside?: string;
  tone?: "dark" | "haldi" | "ivory" | "sindoor";
  props?: Prop[];
  show?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".nr-line", { type: "words", wordsClass: "nr-w" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.6 },
      });
      // words punch in one by one, oversized, then settle
      tl.fromTo(
        split.words,
        { opacity: 0, scale: 2.4, y: -30, rotate: () => gsap.utils.random(-25, 25) },
        { opacity: 1, scale: 1, y: 0, rotate: 0, stagger: 0.06, duration: 0.25, ease: "back.out(2)" },
        0,
      );

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

      // sparkles twinkle forever, each on its own random rhythm
      gsap.utils.toArray<HTMLElement>(".nr-spark").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0, rotate: 0, autoAlpha: 0 },
          {
            scale: () => gsap.utils.random(0.6, 1.4),
            rotate: 90,
            autoAlpha: 1,
            duration: () => gsap.utils.random(0.5, 1.1),
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 2),
          },
        );
      });
      // Props keep partying once they've landed
      gsap.utils.toArray<HTMLElement>(".nr-fly img").forEach((img, i) =>
        gsap.to(img, {
          y: () => -gsap.utils.random(8, 22),
          rotate: () => gsap.utils.random(-14, 14),
          duration: () => gsap.utils.random(0.5, 0.9),
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        }),
      );
      gsap.to(".nr-rays", { rotate: 360, duration: 40, repeat: -1, ease: "none" });

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
    <section className={`nr nr-${tone} ${show ? "nr-show" : ""}`} ref={root} data-wipe>
      {show && <div className="nr-rays" aria-hidden />}
      {show &&
        Array.from({ length: 28 }, (_, i) => (
          <span
            className="nr-spark"
            key={`s${i}`}
            style={{ left: `${(i * 37 + 11) % 97}%`, top: `${(i * 53 + 7) % 93}%`, "--sz": `${10 + ((i * 7) % 18)}px` } as React.CSSProperties}
            aria-hidden
          />
        ))}
      {props.map((p, pi) =>
        p.mode === "fly" ? (
          <div
            className={`nr-prop nr-fly nr-${p.side ?? "left"} ${p.round ? "nr-round" : ""}`}
            data-side={p.side}
            data-jelly
            key={pi}
            style={
              {
                "--top": `${p.top ?? 50}%`,
                "--w": `${p.w ?? 240}px`,
                "--off": `${p.off ?? 3}vw`,
              } as React.CSSProperties
            }
            aria-hidden
          >
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
