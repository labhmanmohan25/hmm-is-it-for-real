"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { AnimationItem } from "lottie-web";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { wedding } from "../wedding";
import Lottie from "./Lottie";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";
import SectionIntro from "./SectionIntro";
import { HeartGlyph } from "./AngularHeart";

// The "No, I'm shy" button runs away this many times, then gives up, so someone who truly
// can't dance can still say so (and we get an honest headcount for the stage).
const DODGES = 4;
// Science's side: the 3 Idiots wedding-crash line, "Hum actually science ki taraf se hai".
// Hotlinked from Tenor (their share/embed media URL).
const SCIENCE_GIF = "https://media1.tenor.com/m/H9HhcHxuS9MAAAAC/hum-actually-science-ki-taraf-se-hai-aamir-khan.gif";
const GIF_RATIO = 2.038;
type Spot = { left: number; top: number; w: number; rot: number };

// Desktop: stuck in whichever empty gutter beside the RSVP card is wider, level with the side
// buttons, so it never covers the form. Phones have no gutter: it pops up centred over a dark
// backdrop for a few seconds instead.
function placeGif(card: DOMRect, anchorY: number): { spot: Spot; overlay: boolean } {
  const W = innerWidth;
  const H = innerHeight;
  const gapL = card.left - 24;
  const gapR = W - card.right - 48; // the card's offset shadow sits on the right
  const gap = Math.max(gapL, gapR);
  if (gap >= 220) {
    const w = Math.min(380, gap - 20);
    const h = w / GIF_RATIO;
    const left = gapR >= gapL ? card.right + 48 + (gapR - w) / 2 : (gapL - w) / 2;
    const top = Math.min(Math.max(20, anchorY - h / 2), H - h - 40);
    return { spot: { left, top, w, rot: gapR >= gapL ? 5 : -5 }, overlay: false };
  }
  const w = Math.min(W - 32, 520);
  return { spot: { left: (W - w) / 2, top: (H - w / GIF_RATIO) / 2, w, rot: -3 }, overlay: true };
}

const taunts = [
  "Arre? The button ran away.",
  "Nice reflexes. Save them for the dance floor.",
  "Sharma ji ka beta is dancing. Just saying.",
  "Last chance. The dhol is already warming up…",
];

export default function Rsvp() {
  const root = useRef<HTMLElement>(null);
  const fireworks = useRef<AnimationItem[]>([]);
  const hearts = useRef<HeartBurstHandle>(null);
  const [side, setSide] = useState<"groom" | "bride" | "science" | null>(null);
  const [dance, setDance] = useState<"yes" | "no" | null>(null);
  const [dodged, setDodged] = useState(0);
  const lastDodge = useRef(0);
  const dodgeCount = useRef(0);
  const noBtn = useRef<HTMLButtonElement>(null);
  const yesBtn = useRef<HTMLButtonElement>(null);
  const sci = useRef<HTMLDivElement>(null);
  const sciTl = useRef<gsap.core.Timeline | null>(null);
  const [sciSpot, setSciSpot] = useState<Spot | null>(null);
  const [food, setFood] = useState<Record<string, "Veg" | "Non-veg">>({});
  // everything is mandatory: native fields are checked on every change, button picks via state
  const [fieldGaps, setFieldGaps] = useState<string[]>(["name", "stay"]);

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

  const checkFields = (form: HTMLFormElement) => {
    const f = new FormData(form);
    const guests = form.elements.namedItem("guests") as HTMLInputElement | null;
    setFieldGaps(
      [
        !String(f.get("name") ?? "").trim() && "name",
        !guests?.validity.valid && "how many",
        !f.getAll("events").length && "events",
        !f.get("stay") && "stay",
      ].filter(Boolean) as string[],
    );
  };
  const missing = [
    fieldGaps.includes("name") && "name",
    fieldGaps.includes("how many") && "how many",
    !side && "whose side",
    fieldGaps.includes("events") && "events",
    wedding.meals.some((m) => !food[m.key]) && "food choice",
    fieldGaps.includes("stay") && "stay",
    !dance && "dance question",
  ].filter(Boolean) as string[];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending.current || status === "saved") return;
    const f = new FormData(e.currentTarget);
    const events = f.getAll("events");
    if (missing.length) {
      setStatus("error");
      setMessage(`Still missing: ${missing.join(", ")}.`);
      return;
    }
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
          events, food, stay: f.get("stay"), dance, note: f.get("note"), submissionId: submissionId.current }),
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

  // Science side: a "Aal izz well" clap meme slides in from the side for a few seconds
  const pickScience = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSide("science");
    const card = root.current?.querySelector(".rs-truck")?.getBoundingClientRect();
    if (!card) return;
    const btn = e.currentTarget.getBoundingClientRect();
    const { spot, overlay } = placeGif(card, btn.top + btn.height / 2);
    sci.current?.classList.toggle("overlay", overlay);
    setSciSpot(spot);
  };

  // slap the GIF on like a wonky sticker, let it wobble while it plays, then peel it off
  useGSAP(
    () => {
      const el = sci.current;
      if (!el || !sciSpot) return;
      sciTl.current?.kill();
      const gif = el.querySelector<HTMLElement>(".rs-sci-gif");
      sciTl.current = gsap
        .timeline({ onComplete: () => setSciSpot(null) })
        .set(el, { autoAlpha: 1 })
        .fromTo(gif, { scale: 0, rotate: sciSpot.rot - 35 }, { scale: 1, rotate: sciSpot.rot, duration: 0.5, ease: "back.out(2.2)" })
        .to(gif, { rotate: sciSpot.rot + 4, y: -6, duration: 0.3, repeat: 15, yoyo: true, ease: "sine.inOut" })
        .to(gif, { scale: 0, rotate: sciSpot.rot + 40, duration: 0.35, ease: "back.in(2)" }, "+=0.2")
        .set(el, { autoAlpha: 0 });
    },
    { dependencies: [sciSpot] },
  );

  // Fling the shy button anywhere on the visible screen (within this section, which clips its
  // overflow), never on top of "Yes" and never under the finger/cursor that was chasing it
  const dodge = useCallback((px?: number, py?: number) => {
    const btn = noBtn.current;
    const sec = root.current;
    if (!btn || !sec) return;
    lastDodge.current = performance.now();
    const r = btn.getBoundingClientRect();
    const curX = Number(gsap.getProperty(btn, "x")) || 0;
    const curY = Number(gsap.getProperty(btn, "y")) || 0;
    // where the button sits with no transform
    const home = { x: r.left - curX, y: r.top - curY };
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    const s = sec.getBoundingClientRect();
    const pad = 16;
    const minX = Math.max(pad, s.left + pad);
    const maxX = Math.min(innerWidth - pad, s.right - pad) - w;
    const minY = Math.max(pad + 10, s.top + pad);
    const maxY = Math.min(innerHeight - pad, s.bottom - pad) - h;
    const yes = yesBtn.current?.getBoundingClientRect();
    let best = { x: 0, y: 0 };
    for (let i = 0; i < 30; i++) {
      const x = minX + Math.random() * Math.max(0, maxX - minX);
      const y = minY + Math.random() * Math.max(0, maxY - minY);
      const hitsYes = yes && x < yes.right + 12 && x + w > yes.left - 12 && y < yes.bottom + 12 && y + h > yes.top - 12;
      const nearPointer = px != null && py != null && Math.hypot(x + w / 2 - px, y + h / 2 - py) < Math.max(w, 180);
      best = { x: x - home.x, y: y - home.y };
      if (!hitsYes && !nearPointer) break;
    }
    gsap.to(btn, { x: best.x, y: best.y, rotate: gsap.utils.random(-18, 18), duration: 0.4, ease: "back.out(1.8)" });
    const n = ++dodgeCount.current;
    setDodged(n);
    // out of breath: it trots back home and finally lets itself be pressed
    if (n >= DODGES) gsap.to(btn, { x: 0, y: 0, rotate: 0, duration: 0.7, delay: 0.6, ease: "elastic.out(1, 0.5)" });
  }, []);
  const gaveUp = dodged >= DODGES;

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

      <link rel="preload" as="image" href={SCIENCE_GIF} />
      <div className="rs-sci" ref={sci} aria-hidden onClick={() => sciTl.current?.progress(1)}>
        {sciSpot && (
          <figure className="rs-sci-gif" style={{ left: sciSpot.left, top: sciSpot.top, width: sciSpot.w }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SCIENCE_GIF} alt="" />
            <figcaption>via Tenor</figcaption>
          </figure>
        )}
      </div>

      <SectionIntro className="rs-intro" aside="Ab bas aapka intezaar hai — now we are only waiting for you.">
        Everything is ready. The band, the biryani, the dancing folks.
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

        <form className="rs-form" onSubmit={submit} onChange={(e) => checkFields(e.currentTarget)}>
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
            <button type="button" className={side === "science" ? "on" : ""} onClick={pickScience}>
              <span aria-hidden>🧪</span> Science&apos;s side
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

          <fieldset className="rs-dance">
            <legend>Stage pe dance? · 18 Jan, right after the varmala</legend>
            <p className="rs-dance-rule">
              The moment the garlands are exchanged, the stage turns into a dance floor. Bring a routine, or our
              volunteer committee will &ldquo;volunteer&rdquo; you, live, to a song of the aunties&apos; choosing.{" "}
              <b>No appeals. No refunds. Possibly Nagin music.</b>
            </p>
            <div className="rs-dance-opts">
              <button
                type="button"
                ref={yesBtn}
                className={`rs-dance-yes ${dance === "yes" ? "on" : ""}`}
                aria-pressed={dance === "yes"}
                onClick={(e) => {
                  setDance("yes");
                  gsap.fromTo(e.currentTarget, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" });
                }}
              >
                <span className="rs-tick" aria-hidden>
                  {dance === "yes" ? "✓" : "💃"}
                </span>{" "}
                I&apos;ll dance! Preparing a stage number
              </button>
              <button
                type="button"
                ref={noBtn}
                className={`rs-dance-no ${dance === "no" ? "on" : ""} ${gaveUp ? "tired" : ""}`}
                aria-pressed={dance === "no"}
                onPointerEnter={(e) => {
                  if (!gaveUp && e.pointerType === "mouse") dodge(e.clientX, e.clientY);
                }}
                onPointerDown={(e) => {
                  if (gaveUp) return;
                  e.preventDefault();
                  dodge(e.clientX, e.clientY);
                }}
                onClick={() => {
                  if (gaveUp) return setDance("no");
                  // keyboard press, or the click that trails a dodge on touch screens
                  if (performance.now() - lastDodge.current > 450) dodge();
                }}
              >
                <span className="rs-tick" aria-hidden>
                  {dance === "no" ? "✓" : "🙈"}
                </span>{" "}
                {gaveUp ? "Fine. I'm genuinely shy." : "No, I'm shy. I can't dance."}
              </button>
            </div>
            <p className="rs-dance-taunt" aria-live="polite">
              {dance === "no"
                ? "Noted, no stage for you. But one thumka in the baraat is non-negotiable."
                : dance === "yes"
                  ? "Legend. Start practising in front of the mirror today."
                  : gaveUp
                    ? "Okay okay, the button gave up. If you really mean it, tap it now."
                    : dodged > 0
                      ? taunts[dodged - 1]
                      : ""}
            </p>
          </fieldset>

          <label className="rs-note">
            <span>Anything else? (optional · allergies, Jain food, dance requests…)</span>
            <textarea name="note" maxLength={2000} rows={2} placeholder="Please play Lollipop Lagelu AND Ami Je Tomar" />
          </label>

          {missing.length > 0 && <p className="rs-lock">🔒 Fill these to unlock Send: {missing.join(", ")}</p>}
          <p className="rs-status" role="status" aria-live="polite">{message}</p>
          <button className="rs-submit truck" type="submit" disabled={missing.length > 0 || status === "sending" || status === "saved"}>
            {status === "sending" ? (
              "Saving…"
            ) : status === "saved" ? (
              "RSVP saved ✓"
            ) : (
              <>
                Send RSVP <HeartGlyph className="rs-submit-heart" tint="#ffd60a" />
              </>
            )}
          </button>
        </form>

        <div className="rs-hazard" aria-hidden />
        <p className="rs-dipper truck">Use dipper at night · Dance at baraat</p>
      </div>
    </section>
  );
}
