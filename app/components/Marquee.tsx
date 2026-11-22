"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";
import AngularHeart, { HeartGlyph } from "./AngularHeart";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";
import Lottie from "./Lottie";

const gang: ArtName[] = ["news-didi", "news-uncle", "news-aunty", "news-chachi", "news-dadi"];
const friendCount = ["1", "2", "3", "5", "8", "13", "21", "∞"];

const bandA = [
  "शुभ विवाह (Shubh Vivah)",
  "শুভ বিবাহ (Shubho Bibaho)",
  "Apurva weds Manmohan",
  "17 & 18 January",
  "Shaadi in Aamchi Mumbai",
];
const bandB = [
  "Haldi",
  "Mehendi",
  "Baraat",
  "Vada Pav",
  "Cutting Chai",
  "Horn OK Please",
  "Ganpati Bappa Morya",
];

function script(text: string) {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "truck";
}

function Band({ items, className }: { items: string[]; className: string }) {
  const row = [...items, ...items, ...items];
  return (
    <div className={`band ${className}`}>
      <div className="band-track">
        {[0, 1].map((copy) => (
          <div className="band-set" key={copy} aria-hidden={copy === 1}>
            {row.map((t, i) => (
              <span key={i} className="band-item">
                {t.includes(" (") ? (
                  <span>
                    <span className={script(t)}>{t.split(" (")[0]}</span>{" "}
                    <small className="band-en">({t.split(" (")[1]}</small>
                  </span>
                ) : (
                  <span className={script(t)}>{t}</span>
                )}
                <i className="band-star">✺</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);
  const heartFill = useRef<SVGRectElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const friends = useRef<HTMLSpanElement>(null);
  const hearts = useRef<HeartBurstHandle>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".band-track");
      const wrap = gsap.utils.wrap(-50, 0);
      const pos = tracks.map(() => 0);
      const base = [-0.014, 0.011];
      const skews = gsap.utils.toArray<HTMLElement>(".band").map((b) =>
        gsap.quickTo(b, "skewX", { duration: 0.6, ease: "power3" }),
      );
      let boost = 0;
      let dir = 1;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 250, 12);
        },
      });

      // Speed up with scroll velocity and flip direction with scroll direction
      const tick = (_: number, dt: number) => {
        boost *= 0.92;
        tracks.forEach((t, i) => {
          pos[i] = wrap(pos[i] + base[i] * dir * (1 + boost) * (dt / 16.7));
          gsap.set(t, { xPercent: pos[i] });
        });
        skews.forEach((s, i) => s((i ? -1 : 1) * dir * Math.min(boost, 8)));
      };
      gsap.ticker.add(tick);

      // The tapes form a V under the book: A runs from the middle of the left edge down to the bottom
      // centre, B from the bottom centre up to the middle of the right edge.
      const placeTapes = () => {
        const w = innerWidth;
        const h = root.current!.offsetHeight;
        const len = Math.hypot(w / 2, h / 2);
        root.current!.style.setProperty("--bw", `${Math.round(len * 2.4)}px`);
        root.current!.style.setProperty("--ang", `${(Math.atan2(h / 2, w / 2) * 180) / Math.PI}deg`);
      };
      placeTapes();
      ScrollTrigger.addEventListener("refreshInit", placeTapes);

      // Chapter 1, a pop-up book. Each page turn is one beat of the story (in order), the real-photo
      // cut-outs on each spread stand up off the paper, and the room's lighting changes with the mood.
      const pop = (tl: gsap.core.Timeline, sel: string, at: number) =>
        tl.fromTo(sel, { rotateX: 88, autoAlpha: 0 }, { rotateX: 0, autoAlpha: 1, stagger: 0.08, duration: 0.3, ease: "back.out(2.2)" }, at);
      const write = (tl: gsap.core.Timeline, sel: string, at: number) =>
        tl.fromTo(`${sel} .bk-line`, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, stagger: 0.12, duration: 0.15 }, at).fromTo(
          `${sel} .bk-hl`,
          { "--hl": 0 },
          { "--hl": 1, stagger: 0.12, duration: 0.15 },
          at + 0.1,
        );
      const turn = (tl: gsap.core.Timeline, leaf: string, at: number, restZ: number) =>
        tl
          .set(leaf, { zIndex: 60 }, at)
          .fromTo(leaf, { rotateY: 0 }, { rotateY: -180, duration: 0.8, ease: "power2.inOut" }, at)
          .set(leaf, { zIndex: restZ }, at + 0.8);

      const count = { v: 0 };
      const fill = { v: 0 };
      let popped = false;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=700%", pin: true, scrub: 1 },
      });
      tl.fromTo(".bk", { y: "45vh", rotate: -8, scale: 0.7, autoAlpha: 0 }, { y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)" }, 0)
        .fromTo(".bk-spread", { xPercent: -25 }, { xPercent: 0, duration: 0.8, ease: "power2.inOut" }, 0.55);
      turn(tl, ".bk-l0", 0.55, 1);

      // 1 · Khanan 2018
      write(tl, ".bk-s1", 1.35);
      pop(tl, ".bk-s1 .pop", 1.45);
      tl.to(".ch-fx", { autoAlpha: 1, duration: 0.2 }, 1.4)
        .fromTo(".bk-stamp-1", { scale: 3, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: -12, autoAlpha: 1, duration: 0.15, ease: "power4.in" }, 1.95)
        .to(".ch-fx", { autoAlpha: 0, duration: 0.2 }, 2.3);

      // 2 · common friends, both from Navi Mumbai
      turn(tl, ".bk-l1", 2.4, 2);
      tl.to(root.current, { "--room": "#4a0d2e", duration: 0.6 }, 2.4);
      write(tl, ".bk-s2", 3.2);
      pop(tl, ".bk-s2 .pop", 3.3);
      tl.to(
        count,
        {
          v: friendCount.length - 1,
          duration: 0.7,
          onUpdate: () => {
            if (friends.current) friends.current.textContent = friendCount[Math.round(count.v)];
          },
        },
        3.3,
      ).fromTo(".bk-nm", { scale: 0, rotate: 20 }, { scale: 1, rotate: -4, duration: 0.2, ease: "back.out(3)" }, 3.9);

      // 3 · Diwali, and a heart gets taken
      turn(tl, ".bk-l2", 4.3, 3);
      tl.to(root.current, { "--room": "#1b0b3a", duration: 0.6 }, 4.3).to(".ch-fx", { autoAlpha: 1, duration: 0.3 }, 5.0);
      write(tl, ".bk-s3", 5.1);
      pop(tl, ".bk-s3 .pop", 5.15);
      tl.to(
        fill,
        {
          v: 100,
          duration: 0.8,
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
        5.4,
      ).to(".ch-fx", { autoAlpha: 0, duration: 0.2 }, 6.3);

      // 4 · 13 December 2018, Khandeshwar station
      turn(tl, ".bk-l3", 6.4, 4);
      tl.to(root.current, { "--room": "#0b2545", duration: 0.6 }, 6.4);
      write(tl, ".bk-s4", 7.2);
      pop(tl, ".bk-s4 .pop", 7.25);
      tl.fromTo(".bk-train", { xPercent: -160 }, { xPercent: 260, duration: 0.7, ease: "power1.in" }, 7.4)
        .fromTo(".bk-stamp-4", { scale: 3, rotate: 30, autoAlpha: 0 }, { scale: 1, rotate: 8, autoAlpha: 1, duration: 0.15, ease: "power4.in" }, 8.0)
        .to(".ch-fx", { autoAlpha: 1, duration: 0.3 }, 8.1)
        .to({}, { duration: 0.5 });

      // pop-ups and diyas stay alive while they are up
      gsap.to(".bk-diya img", { scale: 1.06, duration: 0.18, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.07 });
      gsap.to(".bk-gang .pop", { y: -6, rotate: () => gsap.utils.random(-6, 6), duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.06 });

      // The tapes slide in along their own lines as the section rises into view
      gsap.from(".band", {
        xPercent: (i) => (i ? 25 : -25),
        autoAlpha: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center 60%", scrub: 0.3 },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        ScrollTrigger.removeEventListener("refreshInit", placeTapes);
      };
    },
    { scope: root },
  );

  return (
    <section className="marquee" ref={root} aria-label="Shubh Vivah · Chapter 1: IIT (ISM) Dhanbad">
      <div className="bands">
        <Band items={bandA} className="band-a" />
        <Band items={bandB} className="band-b" />
      </div>

      <div className="ch-fx" aria-hidden>
        <Lottie src="/lottie/fireworks.json" />
        <Lottie src="/lottie/fireworks-gold.json" />
      </div>

      <div className="bk">
        <div className="bk-tilt">
        <div className="bk-spread">
          {/* last right page (spread 4) sits underneath everything */}
          <div className="bk-page bk-r bk-s4">
            <p className="bk-line bk-big">He asked her out.</p>
            <p className="bk-line">
              On the platform. In the winter holidays. <span className="bk-hl bk-hl-pink">With his heart in his hands.</span>
            </p>
            <p className="bk-line bk-ever">
              …and it has been there ever since. <HeartGlyph className="bk-heart" />
            </p>
            <span className="bk-stamp bk-stamp-4 truck">13 · 12 · 2018</span>
            <div className="bk-hearts" aria-hidden>
              <HeartBurst ref={hearts} count={18} />
            </div>
          </div>

          {/* leaf 3: front = spread 3 right, back = spread 4 left */}
          <div className="bk-leaf bk-l3">
            <div className="bk-face bk-page bk-front-page bk-s3">
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
            </div>
            <div className="bk-face bk-page bk-back bk-s4">
              <p className="bk-line bk-date">
                <span className="bk-hl">13 December 2018</span>
              </p>
              <p className="bk-line">Winter holidays, back home.</p>
              <div className="bk-board pop">
                <Image {...art("khandeshwar-board")} alt="Khandeshwar station board" sizes="24vw" />
              </div>
              <div className="bk-train" aria-hidden>
                <Image {...art("local-side")} alt="" sizes="30vw" />
              </div>
            </div>
          </div>

          {/* leaf 2: front = spread 2 right, back = spread 3 left */}
          <div className="bk-leaf bk-l2">
            <div className="bk-face bk-page bk-front-page bk-s2">
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
            </div>
            <div className="bk-face bk-page bk-back bk-s3">
              <p className="bk-line bk-big">Then slowly, slowly…</p>
              <p className="bk-line">
                <span className="bk-hl">Diwali came.</span>
              </p>
              <div className="bk-diya pop">
                <Image {...art("diyas")} alt="Diwali diyas" sizes="20vw" />
              </div>
              <figure className="bk-polaroid pop">
                <Image {...art("rangoli")} alt="Rangoli with diyas" sizes="18vw" />
              </figure>
            </div>
          </div>

          {/* leaf 1: front = spread 1 right, back = spread 2 left */}
          <div className="bk-leaf bk-l1">
            <div className="bk-face bk-page bk-front-page bk-s1">
              <figure className="bk-polaroid bk-ism pop">
                <Image {...art("ism-heritage")} alt="Heritage Building, IIT (ISM) Dhanbad" sizes="24vw" />
                <figcaption>IIT (ISM) Dhanbad</figcaption>
              </figure>
              <span className="bk-stamp bk-stamp-1 truck">Khanan &apos;18</span>
            </div>
            <div className="bk-face bk-page bk-back bk-s2">
              <p className="bk-line bk-big">Got to know each other…</p>
              <p className="bk-line">
                …and found <span className="bk-hl">so many common friends</span>.
              </p>
            </div>
          </div>

          {/* leaf 0: the leather cover; its back is spread 1 left */}
          <div className="bk-leaf bk-l0">
            <div className="bk-face bk-front">
              <div className="bk-foil">
                <span>Chapter I</span>
                <b>IIT (ISM)</b>
                <span>Dhanbad · 2018</span>
              </div>
            </div>
            <div className="bk-face bk-page bk-back bk-s1">
              <h3 className="bk-h bk-line">Chapter 1 · IIT (ISM) Dhanbad</h3>
              <p className="bk-line bk-big">
                <span className="bk-hl">Khanan, 2018.</span>
              </p>
              <p className="bk-line">Two first-years meet.</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
