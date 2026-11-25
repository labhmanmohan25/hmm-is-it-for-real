"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";
import AngularHeart, { HeartGlyph } from "./AngularHeart";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";
import Lottie from "./Lottie";

const gang: ArtName[] = ["news-didi", "news-uncle", "news-aunty", "news-chachi", "news-dadi"];
const friendCount = ["1", "2", "3", "5", "8", "13", "21", "∞"];

export default function Marquee() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const heartFill = useRef<SVGRectElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const friends = useRef<HTMLSpanElement>(null);
  const leaderNum = useRef<HTMLSpanElement>(null);
  const hearts = useRef<HeartBurstHandle>(null);

  useGSAP(
    () => {
      // Chapter 1 as a Bollywood film: a leader counts down, then each slide fills the screen and the
      // next one slides in from the side. Every slide gets the same long stretch of scroll so its
      // beats play out slowly.
      const frames = gsap.utils.toArray<HTMLElement>(".cr-frame");
      const strip = track.current!;
      // Slide i sits at xPercent -i·(100/n) of the strip. Rolls are fixed fromTo pairs, not .to() with
      // measured values: a refresh mid-scroll (fonts, resize, phone toolbar) would otherwise re-record
      // their start points and the strip could jump back to the countdown.
      const step = 100 / frames.length;

      const count = { v: 0 };
      const fill = { v: 0 };
      const lead = { v: 0 };
      let popped = false;
      // The counters are drawn from their tweened objects on every timeline update and after every
      // refresh: a refresh re-renders the timeline with callbacks suppressed, so per-tween onUpdates
      // would leave stale numbers behind.
      const draw = () => {
        const done = Math.min(Math.floor(lead.v), 2);
        if (leaderNum.current) leaderNum.current.textContent = String(3 - done);
        root.current?.style.setProperty("--a", `${(lead.v - done) * 360}deg`);
        if (friends.current) friends.current.textContent = friendCount[Math.round(count.v)];
        if (meter.current) meter.current.textContent = String(Math.round(fill.v));
        heartFill.current?.setAttribute("y", String(182 * (1 - fill.v / 100)));
        if (fill.v > 99 && !popped) {
          popped = true;
          hearts.current?.play();
        } else if (fill.v < 95) popped = false;
      };

      const SLIDE = 2; // timeline length of every slide, roll-in included
      const ROLL = 0.5;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: draw,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          // a little over two screens of scroll per slide, plus the hold on the end card
          end: () => `+=${(frames.length * 2.2 + 0.8) * window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: draw,
        },
      });

      // a reel change: the next slide races in with a motion-blur smear, then settles
      const roll = (i: number) => {
        const at = (i - 1) * SLIDE + 0.6;
        tl.fromTo(strip, { xPercent: -(i - 1) * step }, { xPercent: -i * step, duration: ROLL, ease: "power3.inOut", immediateRender: false }, at)
          .fromTo(".cr-blur", { autoAlpha: 0 }, { autoAlpha: 1, duration: ROLL / 2, ease: "power1.in", yoyo: true, repeat: 1 }, at)
          .fromTo(frames[i], { scale: 0.9, filter: "brightness(0.55)" }, { scale: 1, filter: "brightness(1)", duration: ROLL, ease: "power2.out" }, at);
        return at + ROLL;
      };
      const sub = (sel: string, at: number) => tl.fromTo(sel, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.2 }, at);
      const pop = (sel: string, at: number) =>
        tl.fromTo(sel, { scale: 0.2, rotate: -12, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, stagger: 0.06, duration: 0.25, ease: "back.out(2.2)" }, at);

      gsap.set(strip, { xPercent: 0 });

      // leader: 3 · 2 · 1, one sweep of the clock hand per number
      tl.fromTo(lead, { v: 0 }, { v: 3, duration: 0.6 }, 0);

      // title card
      let t = roll(1);
      tl.fromTo(".cr-title .cr-pre", { autoAlpha: 0, letterSpacing: "1em" }, { autoAlpha: 1, letterSpacing: "0.3em", duration: 0.3 }, t)
        .fromTo(".cr-title b", { scale: 2.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "power4.in" }, t + 0.15)
        .fromTo(".cr-title .cr-cast", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.2 }, t + 0.4);

      // Scene 1 · Khanan 2018: they meet, then the common friends keep turning up
      t = roll(2);
      pop(".cr-s1 .cr-polaroid", t);
      sub(".cr-s1 .cr-sub-1", t + 0.15);
      pop(".cr-s1 .cr-gang .pop", t + 0.4);
      sub(".cr-s1 .cr-sub-2", t + 0.5);
      tl.to(count, { v: friendCount.length - 1, duration: 0.5 }, t + 0.55)
        .fromTo(".cr-nm", { scale: 0, rotate: 20 }, { scale: 1, rotate: -4, duration: 0.2, ease: "back.out(3)" }, t + 1.1)
        .to(".ch-fx", { autoAlpha: 1, duration: 0.15 }, t + 1.15)
        .to(".ch-fx", { autoAlpha: 0, duration: 0.15 }, t + 1.4);

      // Scene 2 · Diwali steals a heart, then 13 December 2018 on the Khandeshwar platform
      t = roll(3);
      pop(".cr-s2 .cr-diya, .cr-s2 .cr-meter", t);
      sub(".cr-s2 .cr-sub-1", t + 0.1);
      tl.to(".ch-fx", { autoAlpha: 1, duration: 0.2 }, t + 0.2)
        .to(fill, { v: 100, duration: 0.5 }, t + 0.2)
        .to(".ch-fx", { autoAlpha: 0, duration: 0.15 }, t + 0.75);
      pop(".cr-s2 .cr-board", t + 0.8);
      tl.fromTo(".cr-train", { xPercent: -160 }, { xPercent: 260, duration: 0.45, ease: "power1.in" }, t + 0.9);
      sub(".cr-s2 .cr-sub-2", t + 1.05);

      // end card: Picture abhi baaki hai
      t = roll(4);
      tl.fromTo(".cr-end .cr-endline", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.25 }, t).to(
        ".ch-fx",
        { autoAlpha: 1, duration: 0.3 },
        t + 0.3,
      );
      // hold on the end card before the page moves on
      tl.to({}, { duration: 1 }, (4 - 1) * SLIDE + 0.6 + SLIDE);

      gsap.to(".cr-diya img", { scale: 1.06, duration: 0.18, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.07 });
      gsap.to(".cr-gang .pop img", { y: -6, rotate: () => gsap.utils.random(-6, 6), duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.06 });
    },
    { scope: root },
  );

  return (
    <section className="marquee cr" ref={root} aria-label="Shubh Vivah · Chapter 1: IIT (ISM) Dhanbad, the film">
      <div className="ch-fx" aria-hidden>
        <Lottie src="/lottie/fireworks.json" />
        <Lottie src="/lottie/fireworks-gold.json" />
      </div>

      <div className="cr-screen">
        <div className="cr-strip" ref={track}>
          {/* leader */}
          <div className="cr-frame cr-leader">
            <div className="cr-sweep" />
            <i className="cr-cross" aria-hidden />
            <span className="cr-num truck" ref={leaderNum}>
              3
            </span>
          </div>

          {/* title card */}
          <div className="cr-frame cr-title">
            <span className="cr-pre truck">ISM Films presents</span>
            <b>
              Khanan
              <br />
              Ki Kahani
            </b>
            <span className="cr-cast">Starring Manmohan &amp; Apurva</span>
            <span className="cr-cast cr-small">Chapter 1 · IIT (ISM) Dhanbad · 2018</span>
          </div>

          {/* scene 1 */}
          <div className="cr-frame cr-scene cr-s1">
            <span className="cr-slate truck">Scene 1 · Khanan, 2018</span>
            <div className="cr-cols">
              <figure className="cr-polaroid">
                <Image {...art("ism-heritage")} alt="Heritage Building, IIT (ISM) Dhanbad" sizes="(max-aspect-ratio: 1/1) 70vw, 34vw" />
              </figure>
              <div className="cr-col">
                <div className="cr-gang">
                  {gang.map((g) => (
                    <span className="pop" key={g}>
                      <Image {...art(g)} alt="" sizes="90px" />
                    </span>
                  ))}
                </div>
                <p className="cr-count">
                  Common friends found: <b className="truck" ref={friends}>1</b>
                </p>
                <p className="cr-nm truck">Plot twist: both from Navi Mumbai!</p>
              </div>
            </div>
            <div className="cr-subs">
              <p className="cr-sub cr-sub-1">Two first-years meet. They get to know each other…</p>
              <p className="cr-sub cr-sub-2 cr-sub-pink">…and find so many common friends.</p>
            </div>
          </div>

          {/* scene 2 */}
          <div className="cr-frame cr-scene cr-s2">
            <span className="cr-slate truck">Scene 2 · Diwali → 13 December 2018</span>
            <div className="cr-cols">
              <div className="cr-col">
                <div className="cr-row">
                  <div className="cr-diya">
                    <Image {...art("diyas")} alt="Diwali diyas" sizes="(max-aspect-ratio: 1/1) 30vw, 14vw" />
                  </div>
                  <div className="cr-meter">
                    <AngularHeart id="cr-heart" ref={heartFill} className="cr-meter-heart" />
                    <span className="cr-meter-num truck">
                      <span ref={meter}>0</span>%
                    </span>
                    <small className="truck">heart stolen</small>
                    <div className="cr-hearts" aria-hidden>
                      <HeartBurst ref={hearts} count={18} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="cr-col cr-station">
                <div className="cr-board">
                  <Image {...art("khandeshwar-board")} alt="Khandeshwar station board" sizes="(max-aspect-ratio: 1/1) 60vw, 30vw" />
                </div>
                <div className="cr-train" aria-hidden>
                  <Image {...art("local-side")} alt="" sizes="40vw" />
                </div>
              </div>
            </div>
            <div className="cr-subs">
              <p className="cr-sub cr-sub-1">Diwali came… and Manmohan&apos;s heart was taken by Apurva.</p>
              <p className="cr-sub cr-sub-2 cr-sub-pink">
                Back home in winter, on the Khandeshwar platform, he asked her out. With his heart in his hands. <HeartGlyph className="cr-heart" />
              </p>
            </div>
          </div>

          {/* end card */}
          <div className="cr-frame cr-end">
            <span className="cr-endline cr-pre truck">…and it has been there ever since</span>
            <b className="cr-endline">Picture abhi baaki hai</b>
            <span className="cr-endline cr-cast">Interval. Samosa break. Next reel: the wedding.</span>
          </div>
        </div>
        <div className="cr-blur" aria-hidden />
        <div className="cr-grain" aria-hidden />
        <div className="cr-vignette" aria-hidden />
      </div>
    </section>
  );
}
