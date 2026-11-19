"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";
import { gsap, useGSAP } from "../gsap";
import { details, isTodo } from "../../../../content/details";
import Lottie from "../Lottie";

// "Our story" as a cheesy 2000s wedding-video trailer, scrubbed by scroll.
// Every picture is a real photo (Wikimedia Commons, credited in the footer) or one of our own photos.
// Our photos are optional cut-outs in /public/story: him.png, her.png, us.png (transparent PNGs).

// Total scroll length, in screen-heights. Timeline positions below use the same unit.
const U = 18;

export function Todo({ v }: { v: string }) {
  return isTodo(v) ? <span className="todo">{v}</span> : <>{v}</>;
}

export type StoryPhotos = {
  him: string | null;
  her: string | null;
  us: string | null;
};

const CAPS: {
  id: string;
  at: number;
  out: number;
  text: string;
  small?: string;
}[] = [
  {
    id: "dhanbad",
    at: 2.5,
    out: 3.5,
    text: "Dhanbad.",
    small: "A college fest.",
  },
  { id: "ladka", at: 3.6, out: 4.5, text: "Ek ladka…", small: "One boy" },
  { id: "ladki", at: 4.6, out: 5.4, text: "Ek ladki…", small: "One girl" },
  { id: "strangers", at: 5.45, out: 6.05, text: "Total strangers." },
  {
    id: "khan",
    at: 7.0,
    out: 8.0,
    text: "Khandeshwar station.",
    small: "Some time later",
  },
  {
    id: "her",
    at: 8.1,
    out: 9.0,
    text: "Her agenda:",
    small: "Collect Photoshop.",
  },
  { id: "his", at: 9.1, out: 10.0, text: "His agenda:", small: "Ask her out." },
  {
    id: "date",
    at: 10.05,
    out: 10.75,
    text: "Only one of them knew it was a date.",
  },
  {
    id: "phir",
    at: 11.4,
    out: 12.5,
    text: "Phir kya tha…",
    small: "And then…",
  },
  { id: "off", at: 12.6, out: 13.7, text: "…the story took off." },
  {
    id: "jan",
    at: 15.7,
    out: 17.0,
    text: "…and on 18 January,",
    small: "it's official.",
  },
];

// Real building photos from Navi Mumbai, cut out as paper stickers for the station collage.
const BUILDINGS = [
  { src: "/story/tr-bld-d.webp", h: 22, rot: -3 },
  { src: "/story/tr-bld-a.webp", h: 46, rot: 4 },
  { src: "/story/tr-bld-c.webp", h: 26, rot: -2 },
  { src: "/story/tr-bld-b.webp", h: 32, rot: 5 },
  { src: "/story/tr-bld-e.webp", h: 34, rot: -4 },
];

function star(r: number) {
  // 5-point star centred on the stage; r is the outer radius in % of the stage size
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(
      `${(50 + Math.cos(a) * rr).toFixed(2)}% ${(50 + Math.sin(a) * rr).toFixed(2)}%`,
    );
  }
  return `polygon(${pts.join(", ")})`;
}

function Pic({
  src,
  todo,
  className,
}: {
  src: string | null;
  todo: string;
  className: string;
}) {
  return (
    <figure className={`tr-pic ${className}`}>
      {src ? (
        <img src={src} alt="" />
      ) : (
        <span className="todo">TODO: {todo}</span>
      )}
    </figure>
  );
}

export default function Story({ photos }: { photos: StoryPhotos }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const one = (sel: string) => el.querySelector<HTMLElement>(sel)!;
      const stage = one(".tr-stage");
      const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const motion = (fn: () => void) => {
        if (!rm) fn();
      };

      gsap.set(
        q(
          ".tr-scene:not(.tr-s0), .tr-cap, .tr-s0 .tr-pres > *, .tr-him, .tr-her, .tr-bld, .tr-board, .tr-us, .tr-petals, .tr-flash",
        ),
        { autoAlpha: 0 },
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${innerHeight * U}`,
          pin: stage,
          scrub: rm ? true : 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            gsap.set(q(".tr-progress"), { scaleX: self.progress }),
        },
      });
      tl.set({}, {}, U);

      const fade = (sel: string, at: number, out?: number, d = 0.25) => {
        tl.to(q(sel), { autoAlpha: 1, duration: d }, at);
        if (out !== undefined)
          tl.to(q(sel), { autoAlpha: 0, duration: d }, out);
      };

      // Captions: gold 3D title slams in big and settles, then shrinks away
      CAPS.forEach((c) => {
        const sel = `.tr-cap-${c.id}`;
        fade(sel, c.at, c.out, 0.18);
        motion(() =>
          tl
            .fromTo(
              q(sel),
              { scale: 2.6, rotate: -6, filter: "blur(8px)" },
              {
                scale: 1,
                rotate: 0,
                filter: "blur(0px)",
                duration: 0.3,
                ease: "back.out(1.8)",
              },
              c.at,
            )
            .to(
              q(sel),
              { scale: 0.6, duration: 0.18, ease: "power2.in" },
              c.out,
            ),
        );
      });

      // ---- 0 · "Labh & Biswas Films present" ---------------------------------
      tl.to(q(".tr-hint"), { autoAlpha: 0, duration: 0.2 }, 0.05);
      fade(".tr-pres-1", 0.2);
      fade(".tr-pres-2", 0.8);
      fade(".tr-pres-3", 1.15);
      motion(() =>
        tl
          .fromTo(
            q(".tr-pres-1"),
            { scale: 3, filter: "blur(16px)" },
            { scale: 1, filter: "blur(0px)", duration: 0.6, ease: "expo.out" },
            0.2,
          )
          .fromTo(
            q(".tr-pres-3"),
            { scale: 0.2, rotate: -20 },
            { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(2)" },
            1.15,
          )
          .fromTo(
            q(".tr-s0 .tr-flare"),
            { xPercent: -120 },
            { xPercent: 260, duration: 1.1, ease: "power1.inOut" },
            0.5,
          ),
      );
      tl.to(q(".tr-s0"), { autoAlpha: 0, duration: 0.3 }, 1.9);

      // ---- 1 · ISM Dhanbad: star wipe in, Ken Burns, the two of them spin in ---
      tl.set(q(".tr-s1"), { autoAlpha: 1 }, 1.9);
      tl.fromTo(
        q(".tr-s1"),
        { clipPath: star(0) },
        { clipPath: star(160), duration: 0.6, ease: "power2.in" },
        1.9,
      );
      motion(() =>
        tl.fromTo(
          q(".tr-s1 .tr-bg"),
          { scale: 1.25 },
          { scale: 1, duration: 4.4 },
          1.9,
        ),
      );
      tl.to(q(".tr-s1 .tr-him"), { autoAlpha: 1, duration: 0.15 }, 3.55).to(
        q(".tr-s1 .tr-her"),
        { autoAlpha: 1, duration: 0.15 },
        4.55,
      );
      motion(() =>
        tl
          .fromTo(
            q(".tr-s1 .tr-him"),
            { xPercent: -260, rotate: -720, scale: 0.3 },
            {
              xPercent: 0,
              rotate: -6,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.4)",
            },
            3.55,
          )
          .fromTo(
            q(".tr-s1 .tr-her"),
            { xPercent: 260, rotate: 720, scale: 0.3 },
            {
              xPercent: 0,
              rotate: 6,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.4)",
            },
            4.55,
          )
          .to(
            q(".tr-s1 .tr-ring"),
            { rotate: 360, duration: 4, repeat: 0 },
            2.0,
          ),
      );

      // ---- 2 · Khandeshwar: the whole ISM frame spins away onto a paper collage ---
      tl.set(q(".tr-s2"), { autoAlpha: 1 }, 6.0);
      if (rm) tl.to(q(".tr-s1"), { autoAlpha: 0, duration: 0.3 }, 6.0);
      else
        tl.to(
          q(".tr-s1"),
          { rotate: 540, scale: 0, duration: 0.6, ease: "power2.in" },
          6.0,
        ).set(q(".tr-s1"), { autoAlpha: 0 }, 6.6);

      q(".tr-bld").forEach((b, i) => {
        tl.set(b, { autoAlpha: 1 }, 6.3 + i * 0.1);
        motion(() =>
          tl.fromTo(
            b,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.35, ease: "back.out(2.2)" },
            6.3 + i * 0.1,
          ),
        );
      });
      fade(".tr-board", 6.8, undefined, 0.1);
      motion(() =>
        tl.fromTo(
          q(".tr-board"),
          { y: () => -innerHeight * 0.8, rotation: -14 },
          { y: 0, rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" },
          6.8,
        ),
      );

      // The train: a paper-cut local that bounces its way left to right across the collage
      motion(() => {
        const train = one(".tr-train");
        tl.fromTo(
          train,
          { x: () => -train.offsetWidth },
          { x: () => stage.clientWidth, duration: 2.9 },
          7.5,
        )
          .fromTo(
            train,
            { y: 0 },
            {
              y: -18,
              duration: 0.12,
              repeat: 23,
              yoyo: true,
              ease: "sine.out",
            },
            7.5,
          )
          .fromTo(
            train,
            { rotate: -1.5 },
            {
              rotate: 1.5,
              duration: 0.24,
              repeat: 11,
              yoyo: true,
              ease: "sine.inOut",
            },
            7.5,
          );
      });
      fade(".tr-s2 .tr-him", 8.1, undefined, 0.12);
      fade(".tr-s2 .tr-her", 8.1, undefined, 0.12);
      motion(() =>
        tl
          .fromTo(
            q(".tr-s2 .tr-him"),
            { yPercent: 120, rotate: -20 },
            { yPercent: 0, rotate: -4, duration: 0.3, ease: "back.out(2)" },
            8.1,
          )
          .fromTo(
            q(".tr-s2 .tr-her"),
            { yPercent: 120, rotate: 20 },
            { yPercent: 0, rotate: 4, duration: 0.3, ease: "back.out(2)" },
            8.15,
          )
          .to(
            q(".tr-s2 .tr-him"),
            { rotate: 8, y: -14, duration: 0.15, repeat: 5, yoyo: true },
            9.1,
          ),
      );

      // ---- 3 · above the clouds: iris in, the plane flies through --------------
      tl.set(q(".tr-s3"), { autoAlpha: 1 }, 10.8);
      tl.fromTo(
        q(".tr-s3"),
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(80% at 50% 50%)",
          duration: 0.5,
          ease: "power2.in",
        },
        10.8,
      );
      tl.set(q(".tr-s2"), { autoAlpha: 0 }, 11.3);
      motion(() => {
        const plane = one(".tr-flight");
        tl.fromTo(
          q(".tr-s3 .tr-bg"),
          { xPercent: 0, scale: 1.12 },
          { xPercent: -4, scale: 1.12, duration: 3.2 },
          10.8,
        )
          .fromTo(
            plane,
            { x: () => -plane.offsetWidth, y: 40, rotate: -4 },
            {
              x: () => stage.clientWidth * 0.5 - plane.offsetWidth * 0.5,
              y: 0,
              rotate: -2,
              duration: 1.4,
              ease: "power2.out",
            },
            10.9,
          )
          .to(
            plane,
            {
              y: -16,
              duration: 0.3,
              repeat: 3,
              yoyo: true,
              ease: "sine.inOut",
            },
            12.3,
          )
          .to(
            plane,
            {
              x: () => stage.clientWidth + 40,
              y: -80,
              rotate: -8,
              duration: 1.0,
              ease: "power2.in",
            },
            13.4,
          )
          .fromTo(
            q(".tr-s3 .tr-flare"),
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, scale: 1.2, duration: 0.6, yoyo: true, repeat: 1 },
            11.5,
          );
      });
      if (rm)
        gsap.set(q(".tr-flight"), {
          x: () =>
            stage.clientWidth * 0.5 - one(".tr-flight").offsetWidth * 0.5,
        });

      // ---- 4 · Swiss meadow, the lotus opens with the two of us inside ----------
      tl.set(q(".tr-s4"), { autoAlpha: 1 }, 14.0);
      tl.fromTo(
        q(".tr-flash"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.12 },
        13.9,
      ).to(q(".tr-flash"), { autoAlpha: 0, duration: 0.3 }, 14.05);
      tl.set(q(".tr-s3"), { autoAlpha: 0 }, 14.05);
      motion(() =>
        tl
          .fromTo(
            q(".tr-s4 .tr-bg"),
            { scale: 1.2 },
            { scale: 1, duration: 3.5 },
            14.0,
          )
          .fromTo(
            q(".tr-tulips"),
            { yPercent: 100 },
            { yPercent: 0, duration: 0.5, ease: "power3.out" },
            14.1,
          )
          .fromTo(
            q(".tr-lotus"),
            { yPercent: 120, scale: 0.3 },
            { yPercent: 0, scale: 1, duration: 0.7, ease: "back.out(1.4)" },
            14.4,
          )
          .fromTo(
            q(".tr-us"),
            { yPercent: 60, scale: 0 },
            { yPercent: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" },
            15.0,
          )
          .to(q(".tr-s4 .tr-ring"), { rotate: -360, duration: 3 }, 15.0),
      );
      fade(".tr-us", 15.0, undefined, 0.15);
      fade(".tr-petals", 14.6, undefined, 0.3);

      // ---- 5 · the end card ---------------------------------------------------
      tl.set(q(".tr-s5"), { autoAlpha: 1 }, 17.0);
      tl.fromTo(
        q(".tr-s5"),
        { clipPath: star(0) },
        { clipPath: star(160), duration: 0.5, ease: "power2.in" },
        17.0,
      );
      q(".tr-end > *").forEach((n, i) => {
        tl.fromTo(
          n,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.15 },
          17.3 + i * 0.12,
        );
        motion(() =>
          tl.fromTo(
            n,
            { scale: 2.2, y: -30 },
            { scale: 1, y: 0, duration: 0.3, ease: "back.out(1.8)" },
            17.3 + i * 0.12,
          ),
        );
      });
    },
    { scope: root },
  );

  const names = `${details.bride.name} weds ${details.groom.name}`;

  return (
    <section
      className="tr"
      ref={root}
      aria-label="Our story, as a 2000s wedding-video trailer"
    >
      <div className="tr-stage">
        {/* 0 · presents */}
        <div className="tr-scene tr-s0">
          <div className="tr-pres">
            <p className="tr-pres-1 tr-gold">Labh &amp; Biswas Films</p>
            <p className="tr-pres-2">proudly present</p>
            <p className="tr-pres-3 tr-gold">A Love Story</p>
          </div>
          <span className="tr-flare" aria-hidden />
          <p className="tr-hint truck">
            Scroll to play <i>▶</i>
          </p>
        </div>

        {/* 1 · ISM Dhanbad */}
        <div className="tr-scene tr-s1">
          <img
            className="tr-bg"
            src="/story/tr-ism.webp"
            alt="Heritage Building, IIT (ISM) Dhanbad"
          />
          <span className="tr-ring tr-ring-a" aria-hidden />
          <div className="tr-duo">
            <Pic
              src={photos.him}
              todo="him.png"
              className="tr-him tr-pic-round"
            />
            <Pic
              src={photos.her}
              todo="her.png"
              className="tr-her tr-pic-round"
            />
          </div>
        </div>

        {/* 2 · Khandeshwar collage */}
        <div className="tr-scene tr-s2">
          <div className="tr-sky" aria-hidden />
          <div className="tr-city">
            {BUILDINGS.map((b) => (
              <img
                key={b.src}
                className="tr-bld tr-paper"
                src={b.src}
                alt=""
                style={{ height: `${b.h}vh`, rotate: `${b.rot}deg` }}
              />
            ))}
          </div>
          <img
            className="tr-board tr-paper"
            src="/story/tr-khan-board.webp"
            alt="Khandeshwar station board"
          />
          <div className="tr-track">
            <img
              className="tr-train tr-paper"
              src="/story/tr-train.webp"
              alt="A Mumbai local train"
            />
            <div className="tr-rails" aria-hidden />
          </div>
          <div className="tr-duo tr-duo-low">
            <Pic
              src={photos.him}
              todo="him.png"
              className="tr-him tr-pic-sticker"
            />
            <Pic
              src={photos.her}
              todo="her.png"
              className="tr-her tr-pic-sticker"
            />
          </div>
        </div>

        {/* 3 · above the clouds */}
        <div className="tr-scene tr-s3">
          <img
            className="tr-bg"
            src="/story/tr-clouds.webp"
            alt="Sunrise over a sea of clouds"
          />
          <span className="tr-flare tr-flare-sun" aria-hidden />
          <div className="tr-flight">
            <Pic src={photos.us} todo="us.png" className="tr-us-plane" />
            <img
              className="tr-plane"
              src="/story/tr-plane.webp"
              alt="An Air India plane"
            />
          </div>
        </div>

        {/* 4 · meadow + lotus */}
        <div className="tr-scene tr-s4">
          <img
            className="tr-bg"
            src="/story/tr-meadow.webp"
            alt="Alpine meadow and lake"
          />
          <div className="tr-petals" aria-hidden>
            <Lottie src="/lottie/marigold-petals.json" fit="cover" />
          </div>
          <div className="tr-bloom">
            <span className="tr-ring tr-ring-b" aria-hidden />
            <Pic src={photos.us} todo="us.png" className="tr-us tr-pic-round" />
            <img className="tr-lotus" src="/story/tr-lotus.webp" alt="" />
          </div>
          <img className="tr-tulips" src="/story/tr-tulips.webp" alt="" />
        </div>

        {/* 5 · end card */}
        <div className="tr-scene tr-s5">
          <img className="tr-bg" src="/story/tr-fireworks.webp" alt="" />
          <div className="tr-end">
            <p className="tr-end-kicker">Coming soon to a mandap near you</p>
            <p className="tr-end-names tr-gold">{names}</p>
            <p className="tr-end-date truck">{details.dateLabel}</p>
            <p className="tr-end-place">
              CIDCO Auditorium · Vashi, Navi Mumbai
            </p>
          </div>
        </div>

        <div className="tr-caps" aria-live="polite">
          {CAPS.map((c) => (
            <p key={c.id} className={`tr-cap tr-cap-${c.id}`}>
              <span className="tr-gold">{c.text}</span>
              {c.small && <small>{c.small}</small>}
            </p>
          ))}
        </div>
        <div className="tr-flash" aria-hidden />
        <div className="tr-bars" aria-hidden />
        <div className="tr-grain" aria-hidden />
        <div className="tr-progress" aria-hidden />
      </div>
    </section>
  );
}
