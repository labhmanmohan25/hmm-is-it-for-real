"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "./gsap";
import { HeartGlyph } from "./AngularHeart";

export type HeartBurstHandle = { play: () => void };

const tints = ["#ff2e88", "#ff4d6d", "#ffd60a", "#d4ff3a"];

// A burst of faceted hearts flying out from the centre of the parent box. Replaces the old
// rounded-heart Lottie so every heart on the site shares the Tota-Myna silhouette.
const HeartBurst = forwardRef<HeartBurstHandle, { count?: number; className?: string }>(function HeartBurst({ count = 14, className }, ref) {
  const root = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play() {
      const box = root.current;
      if (!box) return;
      const reach = Math.min(box.offsetWidth, box.offsetHeight) * 0.5;
      gsap.utils.toArray<HTMLElement>(box.children).forEach((h, i) => {
        const angle = (i / count) * Math.PI * 2 + gsap.utils.random(-0.25, 0.25);
        const dist = reach * gsap.utils.random(0.45, 1);
        gsap.killTweensOf(h);
        gsap
          .timeline()
          .fromTo(
            h,
            { x: 0, y: 0, scale: 0, rotate: 0, autoAlpha: 1 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - reach * 0.15,
              scale: gsap.utils.random(0.6, 1.3),
              rotate: gsap.utils.random(-50, 50),
              duration: 0.9,
              ease: "expo.out",
            },
          )
          .to(h, { y: "+=40", autoAlpha: 0, duration: 0.6, ease: "power1.in" }, 0.7);
      });
    },
  }));

  return (
    <div className={`heart-burst ${className ?? ""}`} ref={root} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <HeartGlyph key={i} className="heart-burst-h" tint={tints[i % tints.length]} />
      ))}
    </div>
  );
});

export default HeartBurst;
