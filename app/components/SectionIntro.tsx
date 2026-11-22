"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";

// Narrator line that opens a section (instead of being its own card). Words light up as you scroll;
// the colour change around it comes purely from the parent section's background.
export default function SectionIntro({ children, aside, className = "" }: { children: string; aside?: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".si-line", { type: "words", wordsClass: "si-w" });
      gsap.fromTo(
        split.words,
        { opacity: 0.12, y: 18, rotate: () => gsap.utils.random(-6, 6) },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "center 50%", scrub: 0.6 },
        },
      );
      gsap.from(".si-mic", {
        rotate: -30,
        scale: 0,
        ease: "back.out(3)",
        duration: 0.8,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <div className={`si ${className}`} ref={root}>
      <span className="si-mic truck">🎙 Narrator</span>
      <p className="si-line">{children}</p>
      {aside && <p className="si-aside">{aside}</p>}
    </div>
  );
}
