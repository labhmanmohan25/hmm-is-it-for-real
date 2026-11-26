"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";
import Lottie from "./Lottie";

// "And so begins a two-day, five-event, zero-sleep marathon."
// Pinned scene, scrubbed by scroll:
//   1. a scoreboard flies in: 2 DAYS · 5 EVENTS · 0 SLEEP (fixed numbers, nothing spins, so the eye reads them)
//   2. a giant SLEEP gets a CANCELLED rubber stamp slammed on it (screen shake)
//   3. the lights go disco, DANCING gets stamped MANDATORY and the kathputli troupe storms the stage
const reels = [
  // Read as one sentence: "a 2-day, 5-event, 0-sleep marathon" — each tile says what its number counts,
  // so the tiles never look like a countdown timer.
  { n: 2, label: "Days of shaadi", hi: "17 & 18 January" },
  { n: 5, label: "Events", hi: "Haldi → Vivah" },
  { n: 0, label: "Hours of sleep", hi: "Zero. Zilch. Shunya." },
];

const dancers: { art: ArtName; cls: string }[] = [
  { art: "puppet-dancer", cls: "mr-d1" },
  { art: "puppet-pair-a", cls: "mr-d2" },
  { art: "puppet-camel", cls: "mr-d3" },
  { art: "puppet-couple", cls: "mr-d4" },
  { art: "puppet-pair-b", cls: "mr-d5" },
];

export default function Marathon() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=600%", pin: true, scrub: 1 },
      });

      // 1. scoreboard
      tl.from(".mr-kicker > *", { yPercent: 120, autoAlpha: 0, stagger: 0.05, duration: 0.25, ease: "back.out(2)" }, 0)
        .from(".mr-tile", { y: "60vh", rotate: (i) => (i - 1) * 25, stagger: 0.08, duration: 0.4, ease: "back.out(1.4)" }, 0.05);
      tl.fromTo(".mr-tile-2", { "--glow": 0 }, { "--glow": 1, duration: 0.2, repeat: 3, yoyo: true }, 1.4)

        // 2. SLEEP → CANCELLED
        .to(".mr-intro", { scale: 0.45, yPercent: -80, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 2.2)
        .fromTo(".mr-sleep", { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.6)" }, 2.4)
        .fromTo(".mr-stamp-x", { scale: 3.5, rotate: -40, autoAlpha: 0 }, { scale: 1, rotate: -14, autoAlpha: 1, duration: 0.18, ease: "power4.in" }, 3.2)
        .to(".mr-stage", { keyframes: { x: [0, -22, 18, -12, 8, -4, 0], y: [0, 10, -8, 6, -3, 0] }, duration: 0.25 }, 3.38)
        .to(".mr-sleep-word", { color: "#5a5a5a", skewX: -8, duration: 0.2 }, 3.38)

        // 3. disco: DANCING → MANDATORY
        .to(".mr-sleep", { yPercent: 160, rotate: 25, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 4.2)
        .fromTo(".mr-disco", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 4.35)
        .fromTo(".mr-dance", { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" }, 4.45)
        .fromTo(".mr-dance-word .ch", { yPercent: 140, rotate: () => gsap.utils.random(-40, 40) }, { yPercent: 0, rotate: 0, stagger: 0.03, duration: 0.3, ease: "back.out(3)" }, 4.5)
        .fromTo(".mr-stamp-ok", { scale: 3.5, rotate: 40, autoAlpha: 0 }, { scale: 1, rotate: 10, autoAlpha: 1, duration: 0.18, ease: "power4.in" }, 5.1)
        .to(".mr-stage", { keyframes: { x: [0, 20, -18, 10, -6, 0], y: [0, -10, 8, -4, 0] }, duration: 0.25 }, 5.28)
        .fromTo(".mr-dancer", { yPercent: 120 }, { yPercent: 0, stagger: 0.06, duration: 0.4, ease: "back.out(1.6)" }, 5.15)
        .from(".mr-tagline", { autoAlpha: 0, y: 30, duration: 0.3 }, 5.6)
        .to({}, { duration: 0.7 });

      // Disco floor keeps moving on its own once it's lit
      gsap.to(".mr-rays", { rotate: 360, duration: 18, repeat: -1, ease: "none" });
      gsap.to(".mr-disco", { "--hue": 360, duration: 4, repeat: -1, ease: "none" });
      gsap.utils.toArray<HTMLElement>(".mr-dancer img").forEach((el, i) => {
        gsap.to(el, {
          y: () => -gsap.utils.random(14, 40),
          rotate: () => gsap.utils.random(-12, 12),
          duration: () => gsap.utils.random(0.22, 0.4),
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          ease: "sine.inOut",
          delay: i * 0.09,
        });
      });
      gsap.to(".mr-dance-word .ch", { y: -10, duration: 0.25, repeat: -1, yoyo: true, stagger: { each: 0.06, repeat: -1, yoyo: true }, ease: "sine.inOut" });
    },
    { scope: root },
  );

  return (
    <section className="mr" ref={root} aria-label="And so begins a two-day, five-event, zero-sleep marathon. Sleep is cancelled. Dancing is mandatory.">
      <div className="mr-rays" aria-hidden />
      <div className="mr-disco" aria-hidden>
        <div className="mr-fireworks">
          <Lottie src="/lottie/fireworks.json" />
          <Lottie src="/lottie/fireworks-gold.json" />
        </div>
      </div>

      <div className="mr-stage" aria-hidden>
        <div className="mr-intro">
        <p className="mr-kicker">
          <span className="truck mr-mic">🎙 Narrator</span>
          <span>And so begins a…</span>
        </p>

        <div className="mr-board">
          {reels.map((r, i) => (
            <div className={`mr-tile mr-tile-${i}`} key={r.label}>
              <div className="mr-reel">
                <div className="mr-strip">
                  <span>{r.n}</span>
                </div>
              </div>
              <b className="truck">{r.label}</b>
              <small>{r.hi}</small>
            </div>
          ))}
        </div>
        <p className="mr-board-sub truck">…non-stop shaadi marathon!</p>
        </div>

        <div className="mr-sleep">
          <span className="mr-sleep-word truck-inline">Sleep</span>
          <span className="mr-stamp mr-stamp-x truck">Cancelled</span>
        </div>

        <div className="mr-dance">
          <span className="mr-dance-word truck-inline">
            {[..."Dancing"].map((c, i) => (
              <span className="ch" key={i}>
                {c}
              </span>
            ))}
          </span>
          <span className="mr-stamp mr-stamp-ok truck">Mandatory</span>
          <p className="mr-tagline">Bring comfortable shoes. And a backup pair.</p>
        </div>

        <div className="mr-dancers">
          {dancers.map((d) => (
            <span className={`mr-dancer ${d.cls}`} key={d.cls}>
              <Image {...art(d.art)} alt="" sizes="200px" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
