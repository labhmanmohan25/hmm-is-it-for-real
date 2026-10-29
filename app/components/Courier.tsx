"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

type Props = {
  // CSS selectors of the element the courier leaves from and lands on
  from: string;
  to: string;
  // Scroll range (ScrollTrigger syntax) over which the flight happens
  trigger: string;
  start: string;
  endTrigger: string;
  end: string;
  spin?: number;
  arc?: number;
  children: React.ReactNode;
};

// Carries one object across a section boundary: it lifts off from `from`, follows the scroll
// on an arc, and lands exactly on `to`. Both anchors hide while the courier is in flight,
// so it reads as the same object travelling between sections. Flight progress is exposed as
// the CSS var --p so the courier's styling can morph from the source look to the target look.
// Unrotated size, centre and on-screen angle of an element, folding in its ancestors' transforms
// (a rotated element's bounding box is inflated, so the box alone would make the courier jump).
function pose(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  let rot = 0;
  let scale = 1;
  for (let n: HTMLElement | null = el; n && n !== document.body; n = n.parentElement) {
    const m = getComputedStyle(n).transform;
    if (m && m !== "none") {
      const d = new DOMMatrix(m);
      // A mirrored ancestor (scale -1 1) is a flip, not a 180° turn
      const flip = d.a * d.d - d.b * d.c < 0 ? -1 : 1;
      rot += (Math.atan2(flip * d.b, flip * d.a) * 180) / Math.PI;
      scale *= Math.hypot(d.a, d.b);
    }
  }
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: el.offsetWidth * scale, h: el.offsetHeight * scale, rot };
}

export default function Courier({ from, to, trigger, start, endTrigger, end, spin = 360, arc = 0.25, children }: Props) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const c = el.current!;
    const ease = gsap.parseEase("power2.inOut");
    const set = (p: number) => {
      const a = document.querySelector<HTMLElement>(from);
      const b = document.querySelector<HTMLElement>(to);
      if (!a || !b) return;
      const flying = p > 0 && p < 1;
      a.style.visibility = p <= 0 ? "" : "hidden";
      b.style.visibility = p >= 1 ? "" : "hidden";
      c.style.visibility = flying ? "visible" : "hidden";
      c.style.setProperty("--p", String(gsap.utils.clamp(0, 1, p)));
      if (!flying) return;
      const pa = pose(a);
      const pb = pose(b);
      const t = ease(p);
      const w = pa.w + (pb.w - pa.w) * t;
      const h = pa.h + (pb.h - pa.h) * t;
      const x = pa.cx + (pb.cx - pa.cx) * t - w / 2;
      const y = pa.cy + (pb.cy - pa.cy) * t - h / 2 - Math.sin(Math.PI * p) * innerHeight * arc;
      // Whole turns only, so it lands at exactly the angle the target is showing
      const turn = Math.round(spin / 360) * 360;
      gsap.set(c, { x, y, width: w, height: h, rotate: pa.rot + (pb.rot + turn - pa.rot) * t });
    };

    // A pinned section stays 100vh tall while its pin-spacer carries the scroll length, so measure the spacer
    const spacer = (sel: string) => {
      const n = document.querySelector<HTMLElement>(sel);
      return n?.parentElement?.classList.contains("pin-spacer") ? n.parentElement : n;
    };

    const st = ScrollTrigger.create({
      trigger: spacer(trigger),
      start,
      endTrigger: spacer(endTrigger),
      end,
      refreshPriority: -1,
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => set(self.progress),
    });
    return () => st.kill();
  });

  return (
    <div className="courier" ref={el} aria-hidden>
      {children}
    </div>
  );
}
