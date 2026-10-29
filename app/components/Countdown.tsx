"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { wedding } from "../wedding";
import { HeartGlyph } from "./AngularHeart";

// Number plates from both home states + where everyone lives now
const units = [
  { key: "d", label: "Days · दिन · দিন", code: "BR 07" },
  { key: "h", label: "Hours · घंटा · ঘণ্টা", code: "WB 01" },
  { key: "m", label: "Minutes · मिनट · মিনিট", code: "MH 43" },
  { key: "s", label: "Seconds · सेकंड · সেকেন্ড", code: <><HeartGlyph className="plate-heart" /> <HeartGlyph className="plate-heart" /></> },
] as const;

type Left = Record<(typeof units)[number]["key"], number>;

function timeLeft(): Left {
  const ms = Math.max(0, new Date(wedding.date).getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}

function Plate({ value, label, code }: { value: number | null; label: string; code: React.ReactNode }) {
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (value === null) return;
    gsap.fromTo(num.current, { rotateX: -100, opacity: 0.2 }, { rotateX: 0, opacity: 1, duration: 0.55, ease: "back.out(2.2)" });
  }, [value]);
  return (
    <div className="plate">
      <span className="plate-code truck">{code}</span>
      <span className="plate-num truck" ref={num}>
        {value === null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="plate-label">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const root = useRef<HTMLElement>(null);
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    const tick = () => setLeft(timeLeft());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  useGSAP(
    () => {
      gsap.from(".plate", {
        rotateX: -110,
        y: 120,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cd-plates", start: "top 80%" },
      });
      gsap.from(".cd-title > *", {
        yPercent: 120,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.fromTo(
        ".cd-bg",
        { yPercent: -15, rotate: -4 },
        { yPercent: 15, rotate: 4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section className="cd" ref={root} data-wipe>
      <div className="cd-bg" aria-hidden>
        <Image {...art("local-train")} alt="" sizes="100vw" />
      </div>

      <h2 className="cd-title">
        <span className="truck-inline">Dhak Dhak</span>
        <span className="cd-title-sub">
          <span className="hi">दिल की धड़कन</span> · <span className="bn">বুক ধুকপুক</span>
          <small className="cd-en">“Heartbeat” — counting down to the big day</small>
        </span>
      </h2>

      <div className="cd-plates">
        {units.map((u) => (
          <Plate key={u.key} value={left ? left[u.key] : null} label={u.label} code={u.code} />
        ))}
      </div>

    </section>
  );
}
