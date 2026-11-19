"use client";

import { useEffect } from "react";
import { gsap } from "./gsap";

const colors = ["#ffb703", "#ff2e88", "#d4ff3a", "#d90429", "#ffd60a", "#2b9348"];

// Every click scatters a burst of marigold-coloured petals.
export default function ClickSpark() {
  useEffect(() => {
    const onClick = (e: PointerEvent) => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      for (let i = 0; i < 14; i++) {
        const p = document.createElement("span");
        p.className = "spark";
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY}px`;
        p.style.background = colors[i % colors.length];
        document.body.appendChild(p);
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
        const dist = gsap.utils.random(50, 130);
        gsap
          .timeline({ onComplete: () => p.remove() })
          .to(p, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            rotate: gsap.utils.random(-360, 360),
            duration: 0.7,
            ease: "expo.out",
          })
          .to(p, { y: `+=${gsap.utils.random(40, 90)}`, opacity: 0, scale: 0.3, duration: 0.6, ease: "power1.in" }, 0.35);
      }
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, []);

  return null;
}
