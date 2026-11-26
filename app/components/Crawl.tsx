"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import Lottie from "./Lottie";

// Chapter 1 as a space-opera opening crawl: a blue "not so long ago…" card, the title flying away
// into the stars, then the story scrolling up a tilted plane, all scrubbed by the page scroll.
// deterministic pseudo-random scatter (same on server and client, so no hydration mismatch)
const rand = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};
const STARS = Array.from({ length: 160 }, (_, i) => ({
  x: Math.round(rand(i + 1) * 1e4) / 100,
  y: Math.round(rand(i + 501) * 1e4) / 100,
  s: 1 + Math.floor(rand(i + 901) * 3),
}));

export default function Crawl() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Beats, in timeline units. Scroll maps linearly onto the timeline (SCREENS_PER_UNIT screens of
      // scroll per unit), so at a steady scroll speed each beat lasts exactly as long as its share:
      //   opening line ~2.5 · title ~5 (twice the line) · crawl ~5.8 · finale + hold ~1
      const PRE = 0.08; // opening line fades in
      const LOGO = 2.6; // title arrives
      const CRAWL = 7.8; // story starts rising
      const CRAWL_LEN = 5.8;
      const END = CRAWL + CRAWL_LEN + 0.15;
      const TOTAL = END + 1.0;
      const SCREENS_PER_UNIT = 0.9;

      // while it lingers the title must fit the screen (phones are narrow): at most 1.5x, else
      // whatever keeps its widest line inside 92% of the viewport
      const logo = root.current!.querySelector<HTMLElement>(".oc-logo")!;
      const fit = () => Math.min(1.5, (window.innerWidth * 0.92) / logo.offsetWidth);
      const phone = () => window.innerWidth < 700;
      // desktop: arrives huge and settles to 1.5x; phones: arrives just over screen width, settles inside it
      const logoFrom = () => (phone() ? fit() * 1.1 : 2.6);
      const logoRest = () => (phone() ? fit() * 0.92 : fit());

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${TOTAL * SCREENS_PER_UNIT * window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // the hero hands over in sindoor; the sky drains to deep space almost at once and the opening
      // line is already there to read, then it holds for a good long stretch of scroll
      tl.fromTo(root.current, { "--sky": "#d90429" }, { "--sky": "#000000", duration: 0.3 }, 0)
        .fromTo(".oc-stars", { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.05)
        // "Not so long ago, in a college far, far away…"
        .fromTo(".oc-pre", { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.22 }, PRE)
        .to(".oc-pre", { scale: 1.04, duration: LOGO - 0.25 - PRE - 0.22 }, PRE + 0.22)
        .to(".oc-pre", { autoAlpha: 0, duration: 0.25 }, LOGO - 0.25)
        // title fills the screen, lingers big enough to read, then shrinks off into the distance
        // (slow at first, faster as it recedes) — about twice as long as the opening line
        .fromTo(".oc-logo", { scale: logoFrom, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, LOGO)
        .to(".oc-logo", { scale: logoRest, duration: 2.0 }, LOGO)
        .to(".oc-logo", { scale: 0.04, duration: 2.7, ease: "power2.in" }, LOGO + 2.0)
        .to(".oc-logo", { autoAlpha: 0, duration: 0.3 }, CRAWL - 0.5)
        // the crawl rises up the tilted plane (once the title is gone) and fades into the far stars
        .fromTo(".oc-text", { yPercent: 0, y: 0 }, { yPercent: -100, y: () => -window.innerHeight * 1.1, duration: CRAWL_LEN }, CRAWL)
        .fromTo(".oc-stars", { y: 0 }, { y: () => -window.innerHeight * 0.15, duration: END - 1.2 }, 1.2)
        // finale: the last crawl lines clear out as the ending lands
        .to(".oc-stage", { autoAlpha: 0, duration: 0.3 }, END - 0.2)
        .fromTo(".oc-end", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, END)
        .to(".oc-fx", { autoAlpha: 1, duration: 0.2 }, END + 0.1)
        .to({}, { duration: 0.01 }, TOTAL - 0.01);

      // stars twinkle on their own
      gsap.utils.toArray<HTMLElement>(".oc-star").forEach((el) =>
        gsap.to(el, {
          opacity: () => gsap.utils.random(0.15, 0.6),
          duration: () => gsap.utils.random(0.6, 2.2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        }),
      );
    },
    { scope: root },
  );

  return (
    <section className="oc" ref={root} aria-label="Chapter 1: how it started, at IIT (ISM) Dhanbad">
      <div className="oc-stars" aria-hidden>
        {STARS.map((st, i) => (
          <i className="oc-star" key={i} style={{ left: `${st.x}%`, top: `${st.y}%`, "--s": `${st.s}px` } as React.CSSProperties} />
        ))}
      </div>

      <p className="oc-pre">
        Not so long ago, in a college
        <br />
        far, far away (Dhanbad)…
      </p>

      <h2 className="oc-logo truck" aria-label="Dil Ka Circuit">
        <span>Dil</span>
        <small>ka</small>
        <span>Circuit</span>
      </h2>

      <div className="oc-stage">
        <div className="oc-plane">
          <div className="oc-text" ref={text}>
            <h3 className="oc-title truck">The Fresher Awakens</h3>
            <p>
              It is a period of first-year chaos. At IIT (ISM) Dhanbad, two freshers from Navi Mumbai cross paths at
              Khanan 2018.
            </p>
            <p>
              He studies Mechanical. She studies Electronics. The plot twist? Back in 11th &amp; 12th, he took electronics
              and she took computer science.
            </p>
            <p>
              So a secret treaty is signed: <b>he tutors her in circuits</b>, <b>she tutors him in code</b>. Somewhere
              between a syntax error and a short circuit, a heart gets compiled.
            </p>
            <p>
              Back home that winter, on the Khandeshwar platform, he finally asks her out. The connection has stayed live
              ever since…
            </p>
          </div>
        </div>
      </div>

      <p className="oc-end">
        <span className="truck">…and on 18 January 2027,</span>
        <b className="truck-inline">it&apos;s official.</b>
      </p>

      <div className="oc-fx" aria-hidden>
        <Lottie src="/lottie/fireworks.json" />
        <Lottie src="/lottie/fireworks-gold.json" />
      </div>
    </section>
  );
}
