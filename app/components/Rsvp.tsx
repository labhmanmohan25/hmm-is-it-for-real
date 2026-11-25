"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { AnimationItem } from "lottie-web";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { wedding } from "../wedding";
import Lottie from "./Lottie";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";
import SectionIntro from "./SectionIntro";

export default function Rsvp() {
  const root = useRef<HTMLElement>(null);
  const fireworks = useRef<AnimationItem[]>([]);
  const hearts = useRef<HeartBurstHandle>(null);
  const [side, setSide] = useState<"groom" | "bride">("groom");
  const [food, setFood] = useState<Record<string, "Veg" | "Non-veg">>({ day1: "Veg", day2: "Veg" });

  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const submissionId = useRef<string | null>(null);
  const sending = useRef(false);

  useGSAP(
    () => {
      gsap.from(".rs-truck", {
        y: 200,
        rotate: -8,
        scale: 0.8,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".rs-truck", start: "top 90%" },
      });
      gsap.from(".rs-title .ch", {
        yPercent: 120,
        rotate: () => gsap.utils.random(-30, 30),
        stagger: 0.04,
        duration: 1,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".rs-truck", start: "top 70%" },
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending.current || status === "saved") return;
    const f = new FormData(e.currentTarget);
    const events = f.getAll("events");
    if (!String(f.get("name")).trim() || !events.length) {
      setStatus("error");
      setMessage("Please enter your name and select at least one event.");
      return;
    }
    submissionId.current ??= crypto.randomUUID();
    sending.current = true;
    setStatus("sending");
    setMessage("Saving your RSVP…");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.get("name"), guests: Number(f.get("guests")), side,
          events, food, stay: f.get("stay"), note: f.get("note"), submissionId: submissionId.current }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "Please try again.");
      setStatus("saved");
      setMessage("Your RSVP is saved! We can’t wait to celebrate with you.");
      const fx = root.current?.querySelector(".rs-fx");
      fx?.classList.add("on");
      fireworks.current.forEach((a) => a.goToAndPlay(0, true));
      hearts.current?.play();
      setTimeout(() => fx?.classList.remove("on"), 4000);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Couldn’t save your RSVP. Please retry.");
    } finally {
      sending.current = false;
    }
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

      <SectionIntro className="rs-intro" aside="Ab bas aapka intezaar hai — now we are only waiting for you.">
        Everything is ready. The band, the biryani, the dancing uncles.
      </SectionIntro>

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
            <input name="name" maxLength={120} required placeholder="Pappu / Bablu / Tuktuki" autoComplete="name" />
          </label>
          <label>
            <span>How many of you</span>
            <input name="guests" type="number" min={1} max={20} defaultValue={1} required />
          </label>

          <fieldset className="rs-side">
            <legend>You are from</legend>
            <button type="button" className={side === "groom" ? "on" : ""} onClick={() => setSide("groom")}>
              <span className="hi">वरपक्ष</span> Groom&apos;s side
            </button>
            <button type="button" className={side === "bride" ? "on" : ""} onClick={() => setSide("bride")}>
              <span className="bn">কনেপক্ষ</span> Bride&apos;s side
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

          {wedding.meals.map((m) => (
            <fieldset className="rs-side rs-food" key={m.key}>
              <legend>Food · {m.label}</legend>
              {(["Veg", "Non-veg"] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  aria-pressed={food[m.key] === v}
                  className={food[m.key] === v ? "on" : ""}
                  onClick={() => setFood((f) => ({ ...f, [m.key]: v }))}
                >
                  <i className={`rs-dot rs-dot-${v === "Veg" ? "veg" : "nonveg"}`} aria-hidden />
                  {v}
                </button>
              ))}
            </fieldset>
          ))}

          <fieldset className="rs-stay">
            <legend>Where will you be staying?</legend>
            <p>Our Friends Only bungalow is booked for the nights of 17 &amp; 18 January 2027 — check-in 17 January, checkout 19 January.</p>
            <label>
              <input type="radio" name="stay" value="own" required />
              <span>I’ll book my own stay</span>
            </label>
            <label>
              <input type="radio" name="stay" value="friends-bungalow" required />
              <span>I’ll join the Friends Only bungalow</span>
            </label>
          </fieldset>

          <label className="rs-note">
            <span>Anything else? (allergies, Jain food, dance requests…)</span>
            <textarea name="note" maxLength={2000} rows={2} placeholder="Please play Lollipop Lagelu AND Ami Je Tomar" />
          </label>

          <p className="rs-status" role="status" aria-live="polite">{message}</p>
          <button className="rs-submit truck" type="submit" disabled={status === "sending" || status === "saved"}>
            {status === "sending" ? "Saving…" : status === "saved" ? "RSVP saved ✓" : "Send RSVP ♥"}
          </button>
        </form>

        <div className="rs-hazard" aria-hidden />
        <p className="rs-dipper truck">Use dipper at night · Dance at baraat</p>
      </div>
    </section>
  );
}
