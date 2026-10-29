"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";
import AngularHeart from "./AngularHeart";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";

// Act 1: the entire mohalla piles onto one kaali-peeli (newspaper cut-outs) and drives east to Bengal.
// Act 2: Kolkata — the heart meter fills. Act 3: the same overloaded taxi drives back west to Mithila
// with the bride's doli strapped on top of the roof crowd. Act 4: plot twist, everyone lives in Mumbai.
const acts = [
  { cls: "jr-head-1", text: "बरियाती चलल बंगाल!", en: "The baraat sets off for Bengal", script: "hi" },
  { cls: "jr-head-2", text: "কলকাতা", en: "Kolkata — target located", script: "bn" },
  { cls: "jr-head-3", text: "मिथिला घुरल", en: "…back to Mithila, with the bride", script: "hi" },
  { cls: "jr-head-4", text: "आणि मुंबई!", en: "…and then Mumbai, obviously", script: "hi" },
];

const notes = [
  { at: 0.04, tag: "Darbhanga", text: "Capacity: 5 passengers. Passengers: 23. Plus one dhol." },
  { at: 0.32, tag: "Kolkata", text: "A Maithil boy meets a Bengali girl. Heart status: dangerously unguarded." },
  { at: 0.56, tag: "Return trip", text: "Heart stolen. Bride on board. Doli on the roof. Rosogolla in the dicky." },
  { at: 0.84, tag: "Plot twist", text: "Both families actually live in Mumbai. See you there" },
];

const riders: { art: ArtName; cls: string }[] = [
  { art: "news-dadi", cls: "rd-roof-1" },
  { art: "news-aunty", cls: "rd-roof-2" },
  { art: "news-chachi", cls: "rd-roof-3" },
  { art: "news-didi", cls: "rd-win-1" },
  { art: "news-uncle", cls: "rd-win-2" },
];

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const heartFill = useRef<SVGRectElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const hearts = useRef<HeartBurstHandle>(null);

  useGSAP(
    () => {
      const taxiA = root.current!.querySelector<HTMLElement>(".jr-taxi-a")!;
      const taxiB = root.current!.querySelector<HTMLElement>(".jr-taxi-b")!;
      const stolen = { v: 0 };
      let popped = false;

      // Overloaded suspension + wobbly passengers
      gsap.to(".jr-taxi-a .jr-taxi-body", { y: -10, rotate: 1.2, duration: 0.22, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".jr-taxi-b .jr-taxi-body", { y: -6, duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.utils.toArray<HTMLElement>(".rd").forEach((r, i) =>
        gsap.to(r, { rotate: i % 2 ? 8 : -8, duration: 0.3 + i * 0.05, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=440%", pin: true, scrub: 1.2 },
      });

      // Act 1 — newspaper baraat drives east (left → right)
      tl.fromTo(taxiA, { x: () => -taxiA.offsetWidth }, { x: () => innerWidth + 40, duration: 0.3 }, 0)
        .from(".jr-paper-head > *", { yPercent: 120, autoAlpha: 0, stagger: 0.02, duration: 0.06, ease: "back.out(2)" }, 0.01)
        .to(".jr-paper", { autoAlpha: 0, y: -80, rotate: -6, duration: 0.05, ease: "power2.in" }, 0.13)
        .to(".jr-bg-news", { autoAlpha: 0, duration: 0.05 }, 0.29)
        .fromTo(".jr-bg-kolkata", { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.2 }, 0.29)

        // Act 2 — Kolkata: the heart fills up
        .to(
          stolen,
          {
            v: 100,
            duration: 0.2,
            onUpdate: () => {
              const v = stolen.v;
              if (meter.current) meter.current.textContent = String(Math.round(v));
              heartFill.current?.setAttribute("y", String(182 * (1 - v / 100)));
              if (v > 99 && !popped) {
                popped = true;
                hearts.current?.play();
              } else if (v < 95) popped = false;
            },
          },
          0.32,
        )

        // Act 3 — back west to Mithila with the doli on the roof (right → left)
        .to(".jr-bg-kolkata", { autoAlpha: 0, duration: 0.05 }, 0.53)
        .fromTo(".jr-bg-mithila", { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.2 }, 0.53)
        .fromTo(taxiB, { x: () => innerWidth + 40 }, { x: () => (innerWidth - taxiB.offsetWidth) / 2, duration: 0.3, ease: "power1.out" }, 0.54)
        .from(".jr-doli-roof", { y: -300, rotate: -20, duration: 0.08, ease: "bounce.out" }, 0.6)
        .from(".jr-jm", { scale: 0, rotate: 25, duration: 0.06, ease: "back.out(2.5)" }, 0.62)
        .from(".jr-jm b", { yPercent: -140, autoAlpha: 0, stagger: 0.004, duration: 0.04, ease: "back.out(3)" }, 0.64)
        .from(".jr-pataka", { scale: 0, rotate: -40, duration: 0.05, ease: "back.out(3)" }, 0.68)

        // Act 4 — plot twist: Mumbai
        .to(".jr-bg-mithila", { autoAlpha: 0, duration: 0.05 }, 0.82)
        .fromTo(".jr-bg-mumbai", { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.18 }, 0.82)
        .fromTo(".jr-road-track", { xPercent: -50 }, { xPercent: 0, duration: 1 }, 0)
        .to(".jr-line-fill", { scaleX: 1, duration: 1 }, 0);

      // Headline swaps
      acts.forEach((a, i) => {
        const at = [0, 0.3, 0.54, 0.83][i];
        if (i > 0) tl.fromTo(`.${a.cls}`, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.04 }, at);
        if (i < acts.length - 1) tl.to(`.${a.cls}`, { yPercent: -110, autoAlpha: 0, duration: 0.04 }, [0.29, 0.53, 0.82][i]);
      });

      gsap.utils.toArray<HTMLElement>(".jr-note").forEach((note, i) => {
        tl.fromTo(note, { autoAlpha: 0, y: 60, rotate: -6 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.04, ease: "back.out(2)" }, notes[i].at);
        if (i < notes.length - 1) tl.to(note, { autoAlpha: 0, y: -60, rotate: 6, duration: 0.04 }, notes[i + 1].at - 0.05);
      });
    },
    { scope: root },
  );

  return (
    <section className="jr" ref={root}>
      <div className="jr-bg jr-bg-news" aria-hidden />
      <div className="jr-bg jr-bg-kolkata">
        <Image {...art("howrah-night-white")} alt="" sizes="100vw" />
      </div>
      <div className="jr-bg jr-bg-mithila">
        <Image {...art("golghar-watercolor")} alt="" sizes="100vw" />
      </div>
      <div className="jr-bg jr-bg-mumbai">
        <Image {...art("sea-link")} alt="" sizes="100vw" />
      </div>
      <div className="jr-shade" aria-hidden />

      {/* Act 1 newspaper front page */}
      <div className="jr-paper" aria-hidden>
        <p className="jr-masthead">The Mithila Times · Darbhanga Edition · Price: 1 rosogolla</p>
        <h3 className="jr-paper-head">
          <span>Entire mohalla</span> <span>boards</span> <span>one taxi</span> <span>to Bengal!</span>
        </h3>
        <p className="jr-paper-sub">Driver confirms: “Roof was empty in the morning. Ab nahi hai.”</p>
      </div>

      <header className="jr-head">
        <p className="truck jr-kicker">Operation Dil Chori · “Operation Heart Theft”</p>
        <div className="jr-head-swap">
          {acts.map((s) => (
            <h2 className={s.cls} key={s.cls}>
              <span className={s.script}>{s.text}</span>
              <small>{s.en}</small>
            </h2>
          ))}
        </div>
      </header>

      <div className="jr-meter">
        <AngularHeart id="jr-heart" ref={heartFill} className="jr-heart" />
        <span className="jr-meter-num truck">
          <span ref={meter}>0</span>%
        </span>
        <small className="truck">of Apurva&apos;s heart stolen</small>
        <div className="jr-hearts" aria-hidden>
          <HeartBurst ref={hearts} count={16} />
        </div>
      </div>

      <div className="jr-notes">
        {notes.map((n) => (
          <div className="jr-note" key={n.tag}>
            <b className="truck">{n.tag}</b>
            <span>{n.text}</span>
          </div>
        ))}
      </div>

      {/* Act 1 taxi: overloaded, newspaper-print */}
      <div className="jr-taxi jr-taxi-a" aria-hidden>
        <div className="jr-taxi-body">
          <Crew />
          <span className="jr-bubble jr-bubble-a">Kolkata kitna door?</span>
          <span className="jr-bubble jr-bubble-b">Bas aa gaye!</span>
        </div>
      </div>

      {/* Act 3 taxi: same taxi + same baraat, mirrored to face west, doli strapped on top of the roof crowd */}
      <div className="jr-taxi jr-taxi-b">
        <div className="jr-taxi-body">
          <div className="jr-doli-roof">
            <Image {...art("madhubani-doli")} alt="The bride's doli — a Madhubani painting — strapped to the roof" sizes="30vw" />
          </div>
          <Crew />
        </div>
        {/* Signage lives outside the mirrored body so it reads left-to-right */}
        <div className="jr-jm" aria-label="Just married">
          <span className="jr-jm-row" aria-hidden>
            {[..."JUST"].map((c, i) => (
              <b key={i} style={{ "--i": i } as React.CSSProperties}>{c}</b>
            ))}
          </span>
          <span className="jr-jm-row jr-jm-row-2" aria-hidden>
            {[..."MARRIED"].map((c, i) => (
              <b key={i} style={{ "--i": i + 4 } as React.CSSProperties}>{c}</b>
            ))}
          </span>
          <small className="jr-jm-tag truck">Horn OK Please</small>
        </div>
        <span className="jr-pataka hi">पटाका</span>
      </div>

      <div className="jr-road" aria-hidden>
        <div className="jr-road-track">
          {Array.from({ length: 32 }, (_, k) => (
            <Image key={k} {...art("truck-horn-hindi")} alt="" sizes="25vw" />
          ))}
        </div>
      </div>

      <div className="jr-line" aria-hidden>
        <span className="jr-line-fill" />
        <i className="truck">Mithila</i>
        <i className="truck">Kolkata</i>
      </div>
    </section>
  );
}

// The baraat crew + newspaper-print taxi, shared by the outbound and return trips.
function Crew() {
  return (
    <>
      {riders.map((r) => (
        <span className={`rd ${r.cls}`} key={r.cls}>
          <Image {...art(r.art)} alt="" sizes="140px" />
        </span>
      ))}
      <span className="rd rd-paag">
        <Image {...art("mithila-paag")} alt="" sizes="100px" />
      </span>
      <Image className="jr-taxi-img jr-news-print" {...art("taxi-side")} alt="" sizes="60vw" />
    </>
  );
}
