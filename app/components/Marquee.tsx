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
  const heartFill = useRef<SVGRectElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const friends = useRef<HTMLSpanElement>(null);
  const hearts = useRef<HeartBurstHandle>(null);

  useGSAP(
    () => {
      // Chapter 1, a pop-up book: two spreads, four pages, one story beat per page. The real-photo
      // cut-outs stand up off the paper and the room's lighting changes with each beat.
      // Wide screens see the whole open book. Portrait phones see one page at a time: the camera rides
      // along with each turning page from right to left, then slides back across to the right page.
      const mm = gsap.matchMedia();
      mm.add({ portrait: "(max-aspect-ratio: 1/1)", wide: "(min-aspect-ratio: 1/1)" }, (ctx) => {
        const portrait = !!ctx.conditions?.portrait;

        const pop = (tl: gsap.core.Timeline, sel: string, at: number) =>
          tl.fromTo(sel, { rotateX: 88, autoAlpha: 0 }, { rotateX: 0, autoAlpha: 1, stagger: 0.07, duration: 0.25, ease: "back.out(2.2)" }, at);
        const write = (tl: gsap.core.Timeline, sel: string, at: number) =>
          tl
            .fromTo(`${sel} .bk-line`, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, stagger: 0.09, duration: 0.14 }, at)
            .fromTo(`${sel} .bk-hl`, { "--hl": 0 }, { "--hl": 1, stagger: 0.09, duration: 0.14 }, at + 0.08);

        // A page turn. The leaf lifts off the stack, flexes as it passes upright, and the light moves
        // with it: its front darkens as it tips away, its back starts in shadow and brightens as it
        // lands, and its shadow slides across the pages underneath.
        const TURN = 0.9;
        const turn = (tl: gsap.core.Timeline, leaf: string, at: number, restZ: number) => {
          const half = TURN / 2;
          tl.set(leaf, { zIndex: 60 }, at)
            .fromTo(leaf, { rotateY: 0 }, { rotateY: -180, duration: TURN, ease: "power2.inOut" }, at)
            .fromTo(leaf, { z: 0, skewY: 0 }, { z: 70, skewY: -3, duration: half, ease: "sine.out" }, at)
            .to(leaf, { z: 0, skewY: 0, duration: half, ease: "sine.in" }, at + half)
            .fromTo(`${leaf} .bk-face:first-child .bk-shade`, { opacity: 0 }, { opacity: 0.75, duration: half, ease: "power1.in" }, at)
            .fromTo(`${leaf} .bk-face:last-child .bk-shade`, { opacity: 0.75 }, { opacity: 0, duration: half, ease: "power1.out" }, at + half)
            .fromTo(".bk-sweep", { xPercent: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: half * 0.8, ease: "power1.in" }, at)
            .to(".bk-sweep", { xPercent: -100, duration: TURN, ease: "power2.inOut" }, at)
            .to(".bk-sweep", { autoAlpha: 0, duration: half * 0.6 }, at + TURN - half * 0.6)
            .set(leaf, { zIndex: restZ }, at + TURN);
          // the camera travels with the page, easing back a touch at the top of the arc
          if (portrait)
            tl.to(".bk-cam", { xPercent: 25, duration: TURN, ease: "power2.inOut" }, at)
              .to(".bk-cam", { scale: 0.86, duration: half, ease: "sine.out" }, at)
              .to(".bk-cam", { scale: 1, duration: half, ease: "sine.in" }, at + half);
        };
        // glide across the spread to the right page (portrait only)
        const toRight = (tl: gsap.core.Timeline, at: number) => {
          if (portrait) tl.to(".bk-cam", { xPercent: -25, duration: 0.45, ease: "power3.inOut" }, at);
          return portrait ? 0.45 : 0.15;
        };

        const count = { v: 0 };
        const fill = { v: 0 };
        let popped = false;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: portrait ? "+=380%" : "+=320%", pin: true, scrub: 0.8 },
        });

        // The closed book drops onto the table (on a phone, the cover alone fills the screen)
        if (portrait) gsap.set(".bk-cam", { xPercent: -25, scale: 1 });
        tl.fromTo(".bk", { y: "45vh", rotate: -8, scale: 0.7, autoAlpha: 0 }, { y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(1.4)" }, 0);
        if (!portrait) tl.fromTo(".bk-spread", { xPercent: -25 }, { xPercent: 0, duration: TURN, ease: "power2.inOut" }, 0.5);

        let t = 0.5;

        // Cover opens → page 1 · Khanan 2018
        turn(tl, ".bk-l0", t, 1);
        t += TURN;
        write(tl, ".bk-p1", t);
        pop(tl, ".bk-p1 .pop", t + 0.15);
        tl.to(".ch-fx", { autoAlpha: 1, duration: 0.2 }, t + 0.2)
          .fromTo(".bk-stamp-1", { scale: 3, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: -12, autoAlpha: 1, duration: 0.15, ease: "power4.in" }, t + 0.45)
          .to(".ch-fx", { autoAlpha: 0, duration: 0.2 }, t + 0.7);
        t += 0.8;

        // page 2 · common friends, both from Navi Mumbai
        tl.to(root.current, { "--room": "#4a0d2e", duration: 0.4 }, t);
        t += toRight(tl, t);
        write(tl, ".bk-p2", t);
        pop(tl, ".bk-p2 .pop", t + 0.1);
        tl.to(
          count,
          {
            v: friendCount.length - 1,
            duration: 0.5,
            onUpdate: () => {
              if (friends.current) friends.current.textContent = friendCount[Math.round(count.v)];
            },
          },
          t + 0.2,
        ).fromTo(".bk-nm", { scale: 0, rotate: 20 }, { scale: 1, rotate: -4, duration: 0.2, ease: "back.out(3)" }, t + 0.7);
        t += 1;

        // Turn → page 3 · Diwali, and a heart gets taken
        turn(tl, ".bk-l1", t, 2);
        tl.to(root.current, { "--room": "#1b0b3a", duration: 0.5 }, t);
        t += TURN;
        write(tl, ".bk-p3", t);
        pop(tl, ".bk-p3 .pop", t + 0.1);
        tl.to(".ch-fx", { autoAlpha: 1, duration: 0.3 }, t).to(
          fill,
          {
            v: 100,
            duration: 0.6,
            onUpdate: () => {
              const v = fill.v;
              if (meter.current) meter.current.textContent = String(Math.round(v));
              heartFill.current?.setAttribute("y", String(182 * (1 - v / 100)));
              if (v > 99 && !popped) {
                popped = true;
                hearts.current?.play();
              } else if (v < 95) popped = false;
            },
          },
          t + 0.35,
        ).to(".ch-fx", { autoAlpha: 0, duration: 0.2 }, t + 1);
        t += 1.1;

        // page 4 · 13 December 2018, Khandeshwar station
        tl.to(root.current, { "--room": "#0b2545", duration: 0.4 }, t);
        t += toRight(tl, t);
        write(tl, ".bk-p4", t);
        pop(tl, ".bk-p4 .pop", t + 0.1);
        tl.fromTo(".bk-train", { xPercent: -160 }, { xPercent: 260, duration: 0.5, ease: "power1.in" }, t + 0.15)
          .fromTo(".bk-stamp-4", { scale: 3, rotate: 30, autoAlpha: 0 }, { scale: 1, rotate: 8, autoAlpha: 1, duration: 0.15, ease: "power4.in" }, t + 0.8)
          .to(".ch-fx", { autoAlpha: 1, duration: 0.3 }, t + 0.85);
        t += 1.1;
        // on a phone, step back for one last look at the whole open book
        if (portrait) tl.to(".bk-cam", { xPercent: 0, scale: 0.52, duration: 0.45, ease: "power2.inOut" }, t);
        tl.to({}, { duration: 0.6 }, t);
      });

      // pop-ups and diyas stay alive while they are up
      gsap.to(".bk-diya img", { scale: 1.06, duration: 0.18, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.07 });
      gsap.to(".bk-gang .pop", { y: -6, rotate: () => gsap.utils.random(-6, 6), duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.06 });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="marquee" ref={root} aria-label="Shubh Vivah · Chapter 1: IIT (ISM) Dhanbad">
      <div className="ch-fx" aria-hidden>
        <Lottie src="/lottie/fireworks.json" />
        <Lottie src="/lottie/fireworks-gold.json" />
      </div>

      <div className="bk">
        <div className="bk-cam">
          <div className="bk-tilt">
            <div className="bk-spread">
              <div className="bk-sweep" aria-hidden />

              {/* page 4 (last right page) sits underneath everything */}
              <div className="bk-page bk-r bk-p4">
                <p className="bk-line bk-date">
                  <span className="bk-hl">13 December 2018</span>
                </p>
                <p className="bk-line">Winter holidays, back home.</p>
                <div className="bk-board pop">
                  <Image {...art("khandeshwar-board")} alt="Khandeshwar station board" sizes="20vw" />
                </div>
                <div className="bk-train" aria-hidden>
                  <Image {...art("local-side")} alt="" sizes="30vw" />
                </div>
                <p className="bk-line bk-big">He asked her out.</p>
                <p className="bk-line">
                  On the platform. <span className="bk-hl bk-hl-pink">With his heart in his hands.</span>
                </p>
                <p className="bk-line bk-ever">
                  …and it has been there ever since. <HeartGlyph className="bk-heart" />
                </p>
                <span className="bk-stamp bk-stamp-4 truck">13 · 12 · 2018</span>
              </div>

              {/* leaf 1: front = page 2, back = page 3 */}
              <div className="bk-leaf bk-l1">
                <div className="bk-face bk-page bk-front-page bk-p2">
                  <p className="bk-line bk-big">Got to know each other…</p>
                  <p className="bk-line">
                    …and found <span className="bk-hl">so many common friends</span>.
                  </p>
                  <div className="bk-gang">
                    {gang.map((g) => (
                      <span className="pop" key={g}>
                        <Image {...art(g)} alt="" sizes="80px" />
                      </span>
                    ))}
                  </div>
                  <p className="bk-line bk-count">
                    Common friends found: <b className="truck" ref={friends}>1</b>
                  </p>
                  <p className="bk-nm truck">Plot twist: both from Navi Mumbai!</p>
                  <i className="bk-shade" aria-hidden />
                </div>
                <div className="bk-face bk-page bk-back bk-p3">
                  <p className="bk-line bk-big">Then slowly, slowly…</p>
                  <p className="bk-line">
                    <span className="bk-hl">Diwali came.</span>
                  </p>
                  <div className="bk-diya pop">
                    <Image {...art("diyas")} alt="Diwali diyas" sizes="16vw" />
                  </div>
                  <p className="bk-line">
                    …and <span className="bk-hl bk-hl-pink">Manmohan&apos;s heart was taken by Apurva.</span>
                  </p>
                  <div className="bk-meter pop">
                    <AngularHeart id="bk-heart" ref={heartFill} className="bk-meter-heart" />
                    <span className="bk-meter-num truck">
                      <span ref={meter}>0</span>%
                    </span>
                    <small className="truck">heart stolen</small>
                  </div>
                  <div className="bk-hearts" aria-hidden>
                    <HeartBurst ref={hearts} count={18} />
                  </div>
                  <i className="bk-shade" aria-hidden />
                </div>
              </div>

              {/* leaf 0: the leather cover; its back is page 1 */}
              <div className="bk-leaf bk-l0">
                <div className="bk-face bk-front">
                  <div className="bk-foil">
                    <span>Chapter I</span>
                    <b>IIT (ISM)</b>
                    <span>Dhanbad · 2018</span>
                  </div>
                  <i className="bk-shade" aria-hidden />
                </div>
                <div className="bk-face bk-page bk-back bk-p1">
                  <h3 className="bk-h bk-line">Chapter 1 · IIT (ISM) Dhanbad</h3>
                  <p className="bk-line bk-big">
                    <span className="bk-hl">Khanan, 2018.</span>
                  </p>
                  <p className="bk-line">Two first-years meet.</p>
                  <figure className="bk-polaroid bk-ism pop">
                    <Image {...art("ism-heritage")} alt="Heritage Building, IIT (ISM) Dhanbad" sizes="24vw" />
                    <figcaption>IIT (ISM) Dhanbad</figcaption>
                  </figure>
                  <span className="bk-stamp bk-stamp-1 truck">Khanan &apos;18</span>
                  <i className="bk-shade" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
