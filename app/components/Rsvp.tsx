"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { AnimationItem } from "lottie-web";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { wedding } from "../wedding";
import Lottie from "./Lottie";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";

export default function Rsvp() {
  const root = useRef<HTMLElement>(null);
  const fireworks = useRef<AnimationItem[]>([]);
  const hearts = useRef<HeartBurstHandle>(null);
  const [side, setSide] = useState<"bihar" | "bengal">("bihar");

  useGSAP(
    () => {
      gsap.from(".rs-truck", {
        y: 200,
        rotate: -8,
        scale: 0.8,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".rs-title .ch", {
        yPercent: 120,
        rotate: () => gsap.utils.random(-30, 30),
        stagger: 0.04,
        duration: 1,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });
      gsap.to(".rs-alpona", {
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Magnetic submit button
      const btn = root.current!.querySelector<HTMLElement>(".rs-submit")!;
      const mx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
      const my = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.35);
        my((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener("pointerleave", () => {
        mx(0);
        my(0);
      });
    },
    { scope: root },
  );

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const events = f.getAll("events").join(", ") || "All of them!";
    const text = [
      `RSVP OK PLEASE 🎉 ${wedding.hashtag}`,
      `Name: ${f.get("name")}`,
      `Guests: ${f.get("guests")}`,
      `Side: ${side === "bihar" ? "Groom's side (Mithila)" : "Bride's side (Bengal)"}`,
      `Coming for: ${events}`,
      f.get("note") ? `Note: ${f.get("note")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const fx = root.current!.querySelector(".rs-fx")!;
    fx.classList.add("on");
    fireworks.current.forEach((a) => a.goToAndPlay(0, true));
    hearts.current?.play();
    setTimeout(() => fx.classList.remove("on"), 4000);
    gsap.fromTo(".rs-truck", { rotate: -2 }, { rotate: 0, duration: 0.8, ease: "elastic.out(1.4, 0.3)" });
    window.open(`https://wa.me/${wedding.rsvpWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <section className="rs" ref={root} id="rsvp" data-wipe>
      <div className="rs-alpona" aria-hidden>
        <Image {...art("alpona-peacock")} alt="" sizes="120vmin" />
      </div>

      <div className="rs-fx" aria-hidden>
        {["/lottie/fireworks.json", "/lottie/fireworks-gold.json"].map((src) => (
          <Lottie key={src} src={src} loop={false} autoplay={false} onReady={(a) => fireworks.current.push(a)} />
        ))}
        <HeartBurst ref={hearts} count={22} />
      </div>

      <div className="rs-truck">
        <div className="rs-crown" aria-hidden />
        <h2 className="rs-title truck-inline" aria-label="RSVP OK Please">
          {"RSVP OK PLEASE".split("").map((c, i) => (
            <span className={c === "O" || c === "K" ? "ch ch-hi" : "ch"} key={i} aria-hidden>
              {c === " " ? " " : c}
            </span>
          ))}
        </h2>
        <p className="rs-sub">
          <span className="hi">आइएगा ज़रूर</span> · <span className="bn">অবশ্যই আসবেন</span>
          <small className="rs-en">“Please do come!” in Hindi &amp; Bengali</small>
        </p>

        <form className="rs-form" onSubmit={submit}>
          <label>
            <span>Your good name</span>
            <input name="name" required placeholder="Pappu / Bablu / Tuktuki" autoComplete="name" />
          </label>
          <label>
            <span>How many of you</span>
            <input name="guests" type="number" min={1} max={20} defaultValue={1} required />
          </label>

          <fieldset className="rs-side">
            <legend>You are from</legend>
            <button type="button" className={side === "bihar" ? "on" : ""} onClick={() => setSide("bihar")}>
              <span className="hi">वरपक्ष</span> Groom&apos;s side (Mithila)
            </button>
            <button type="button" className={side === "bengal" ? "on" : ""} onClick={() => setSide("bengal")}>
              <span className="bn">কনেপক্ষ</span> Bride&apos;s side (Bengal)
            </button>
          </fieldset>

          <fieldset className="rs-events">
            <legend>Coming for</legend>
            {wedding.events.map((e) => (
              <label key={e.name}>
                <input type="checkbox" name="events" value={e.name} defaultChecked />
                <span>{e.name}</span>
              </label>
            ))}
          </fieldset>

          <label className="rs-note">
            <span>Anything else? (dietary, dance requests…)</span>
            <textarea name="note" rows={2} placeholder="Please play Lollipop Lagelu AND Ami Je Tomar" />
          </label>

          <button className="rs-submit truck" type="submit">
            Send on WhatsApp ↗
          </button>
        </form>

        <div className="rs-hazard" aria-hidden />
        <p className="rs-dipper truck">Use dipper at night · Dance at baraat</p>
      </div>
    </section>
  );
}
