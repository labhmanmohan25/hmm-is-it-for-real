"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { AnimationItem } from "lottie-web";
import { gsap, useGSAP } from "./gsap";
import { art } from "../../art";
import { details as wedding } from "../../../content/details";
import Lottie from "./Lottie";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";
import { toast } from "../_lib/toast";
import { setTrip } from "../_lib/store";
import { pretty } from "../_lib/dates";

const SIDES = [
  { id: "groom", label: "Groom's side", native: "वरपक्ष", cls: "hi" },
  { id: "bride", label: "Bride's side", native: "কনেপক্ষ", cls: "bn" },
  { id: "ism", label: "ISM gang", native: "Dhanbad", cls: "truck" },
] as const;
const MEALS = ["Veg", "Non-veg", "Jain"] as const;

const DEFAULT_ARRIVE = "2027-01-16";
const DEFAULT_LEAVE = "2027-01-19";

export default function Rsvp() {
  const root = useRef<HTMLElement>(null);
  const fireworks = useRef<AnimationItem[]>([]);
  const hearts = useRef<HeartBurstHandle>(null);
  const [side, setSide] = useState<(typeof SIDES)[number]["id"] | null>(null);
  const [meal, setMeal] = useState<(typeof MEALS)[number] | null>(null);
  const [stay, setStay] = useState(false);
  const [arrive, setArrive] = useState(DEFAULT_ARRIVE);
  const [leave, setLeave] = useState(DEFAULT_LEAVE);
  const flags = useRef({ crowd: false, name: false, photoshop: false });

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

      // Magnetic submit button (mouse only)
      const btn = root.current!.querySelector<HTMLElement>(".rs-submit")!;
      const mx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
      const my = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
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

  // ---- Easter eggs (pop-ups only; nothing here ever blocks submitting) ----
  const onName = (v: string) => {
    const hit = /^\s*(apurva|manmohan)\s*$/i.test(v);
    if (hit && !flags.current.name) toast("Nice try.");
    flags.current.name = hit;
  };
  const onGuests = (v: string) => {
    const big = Number(v) > 8;
    if (big && !flags.current.crowd) toast("Are you bringing the whole hostel?");
    flags.current.crowd = big;
  };
  const onNote = (v: string) => {
    const hit = /photoshop/i.test(v);
    if (hit && !flags.current.photoshop) toast("We know a guy.");
    flags.current.photoshop = hit;
  };

  const changeDates = (a: string, l: string) => {
    setArrive(a);
    setLeave(l);
    if (a && l) setTrip({ arrive: a, leave: l });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const events = f.getAll("events").join(", ") || "All of them!";
    const sideLabel = SIDES.find((s) => s.id === side)?.label ?? "Not picked";
    if (arrive && leave) setTrip({ arrive, leave });
    const text = [
      `RSVP OK PLEASE 🎉 ${wedding.hashtag}`,
      `Name: ${f.get("name")}`,
      `Guests: ${f.get("guests")}`,
      `Side: ${sideLabel}`,
      `Meal: ${meal ?? "Not picked"}`,
      `Stay: ${stay ? "Please arrange my stay" : "Not needed"}`,
      `Arriving: ${arrive ? pretty(arrive, true) : "Not set"}`,
      `Leaving: ${leave ? pretty(leave, true) : "Not set"}`,
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
              {c === " " ? " " : c}
            </span>
          ))}
        </h2>
        <p className="rs-sub">
          <span className="hi">आइएगा ज़रूर</span> · <span className="bn">অবশ্যই আসবেন</span>
          <small className="rs-en">“Please do come!”</small>
        </p>

        <form className="rs-form" onSubmit={submit}>
          <label>
            <span>Your good name</span>
            <input name="name" required placeholder="Pappu / Bablu / Tuktuki" autoComplete="name" onChange={(e) => onName(e.target.value)} />
          </label>
          <label>
            <span>How many of you</span>
            <input name="guests" type="number" min={1} max={20} defaultValue={1} required onChange={(e) => onGuests(e.target.value)} />
          </label>

          <fieldset className="rs-side rs-side-3">
            <legend>You are from</legend>
            {SIDES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={side === s.id}
                className={side === s.id ? "on" : ""}
                onClick={() => {
                  setSide(s.id);
                  if (s.id === "ism") toast("Of course you're here. This is technically your fault.");
                }}
              >
                <span className={s.cls}>{s.native}</span> {s.label}
              </button>
            ))}
          </fieldset>

          <fieldset className="rs-side rs-side-3">
            <legend>Meal</legend>
            {MEALS.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={meal === m}
                className={meal === m ? "on" : ""}
                onClick={() => setMeal(m)}
              >
                {m}
              </button>
            ))}
          </fieldset>

          <fieldset className="rs-side">
            <legend>Stay</legend>
            <button type="button" aria-pressed={stay} className={stay ? "on" : ""} onClick={() => setStay((v) => !v)}>
              {stay ? "✓ " : ""}Please arrange my stay
            </button>
          </fieldset>

          <div className="rs-dates">
            <label>
              <span>Arriving on</span>
              <input type="date" name="arrive" value={arrive} min="2027-01-01" max={leave || "2027-02-28"} onChange={(e) => changeDates(e.target.value, leave)} />
            </label>
            <label>
              <span>Leaving on</span>
              <input type="date" name="leave" value={leave} min={arrive || "2027-01-01"} max="2027-02-28" onChange={(e) => changeDates(arrive, e.target.value)} />
            </label>
            <a className="rs-dates-hint" href="#mumbai">
              We&apos;ll fit your Mumbai plan around these dates ↑
            </a>
          </div>

          <fieldset className="rs-events">
            <legend>Coming for (leave blank = all of them)</legend>
            {wedding.events.map((e) => (
              <label key={e.name}>
                <input
                  type="checkbox"
                  name="events"
                  value={e.name}
                  onChange={(ev) => {
                    if (ev.target.checked && e.name.startsWith("Vivah")) toast("3 AM? Respect. Chai is on us.");
                  }}
                />
                <span>
                  {e.name}
                  {e.friendsOnly ? " (friends only)" : ""}
                </span>
              </label>
            ))}
          </fieldset>

          <label className="rs-note">
            <span>Anything else? (allergies, dance requests…)</span>
            <textarea name="note" rows={2} placeholder="Please play Lollipop Lagelu AND Ami Je Tomar" onChange={(e) => onNote(e.target.value)} />
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
