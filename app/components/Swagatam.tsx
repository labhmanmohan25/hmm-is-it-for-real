"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import type { AnimationItem } from "lottie-web";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { wedding } from "../wedding";
import Lottie from "./Lottie";
import Gloss from "./Gloss";
import AngularHeart from "./AngularHeart";
import HeartBurst, { type HeartBurstHandle } from "./HeartBurst";

const greetings = [
  { text: "स्वागत अछि", en: "Welcome — in Maithili, the groom's mother tongue" },
  { text: "স্বাগতম", en: "Welcome — in Bengali, the bride's mother tongue" },
  { text: "स्वागत आहे", en: "Welcome — in Marathi, because Mumbai is home" },
  { text: "स्वागतम्", en: "Welcome — in Sanskrit, because why not all of them" },
];

export default function Swagatam() {
  const root = useRef<HTMLElement>(null);
  const mandala = useRef<AnimationItem | null>(null);
  const frame = useRef({ p: 0 });
  const hearts = useRef<HeartBurstHandle>(null);

  const onMandala = useCallback((anim: AnimationItem) => {
    mandala.current = anim;
    anim.goToAndStop(frame.current.p * (anim.totalFrames - 1), true);
  }, []);

  useGSAP(
    () => {
      // Greeting cycles like a split-flap board
      const items = gsap.utils.toArray<HTMLElement>(".sw-greet-item");
      gsap.set(items, { rotateX: -90, autoAlpha: 0 });
      const cycle = gsap.timeline({ repeat: -1, paused: true });
      items.forEach((el) => {
        cycle
          .to(el, { rotateX: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(2)" })
          .to(el, { rotateX: 90, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "+=1.6");
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            onEnter: () => cycle.play(),
            onLeave: () => cycle.pause(),
            onEnterBack: () => cycle.play(),
            onLeaveBack: () => cycle.pause(),
          },
        })
        .from(".sw-toran", { yPercent: -120, duration: 1.2, ease: "elastic.out(1, 0.5)" })
        .from(".sw-garland", { yPercent: -110, duration: 1.4, stagger: 0.1, ease: "bounce.out" }, 0)
        .from(".sw-kalash", { scale: 0, rotate: (i) => (i ? 40 : -40), duration: 1, ease: "back.out(2.5)" }, 0.3)
        .from(".sw-card-mithila", { x: "-60vw", rotate: -25, duration: 1.3, ease: "expo.out" }, 0.1)
        .from(".sw-card-bengal", { x: "60vw", rotate: 25, duration: 1.3, ease: "expo.out" }, 0.1)
        .from(".sw-note", { y: 40, autoAlpha: 0, duration: 0.8 }, 0.6);

      gsap.to(".sw-garland", { rotate: (i) => (i ? -4 : 4), duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 0%" });
      gsap.to(".sw-kalash", { y: -10, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.7 });
      gsap.to(".sw-paag", { rotate: 10, y: -8, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".sw-mukut", { rotate: 6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".sw-alpona", {
        rotate: 180,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      // The two families' emblems (with the paag and mukut riding on them) leave their cards, fly to
      // the middle and merge; a golden mandala blooms there into one heart. Desktop pins the cards
      // and slides them apart to make room; on phones the cards are stacked, so it just scrubs.
      const cards = root.current!.querySelector<HTMLElement>(".sw-cards")!;
      const SPREAD = 30; // xPercent each card slides outwards on desktop
      const mm = gsap.matchMedia();
      mm.add({ desk: "(min-width: 769px)", phone: "(max-width: 768px)" }, (ctx) => {
        const desk = !!ctx.conditions?.desk;
        // emblem centre → cards centre, from layout offsets (immune to the tweens' own transforms)
        const delta = (el: HTMLElement, axis: "x" | "y") => {
          const card = el.closest<HTMLElement>(".sw-card")!;
          const shift = desk ? (card.classList.contains("sw-card-mithila") ? -1 : 1) * (SPREAD / 100) * card.offsetWidth : 0;
          return axis === "x"
            ? cards.offsetWidth / 2 - (card.offsetLeft + el.offsetLeft + el.offsetWidth / 2) - shift
            : cards.offsetHeight / 2 - (card.offsetTop + el.offsetTop + el.offsetHeight / 2);
        };
        const ems = gsap.utils.toArray<HTMLElement>(".sw-card-art");
        let burst = false;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desk
            ? { trigger: cards, start: "center 55%", end: "+=170%", pin: true, scrub: 1, invalidateOnRefresh: true }
            : { trigger: cards, start: "top 35%", end: "bottom 45%", scrub: 1, invalidateOnRefresh: true },
        });
        if (desk) {
          tl.to(".sw-card-mithila", { xPercent: -SPREAD, duration: 0.8, ease: "power2.inOut" }, 0).to(
            ".sw-card-bengal",
            { xPercent: SPREAD, duration: 0.8, ease: "power2.inOut" },
            0,
          );
        }
        ems.forEach((el, i) =>
          tl.to(el, { x: () => delta(el, "x"), y: () => delta(el, "y"), rotate: i ? 540 : -540, scale: 0.75, duration: 1, ease: "power2.in" }, 0.2),
        );
        tl.to(ems, { scale: 0, autoAlpha: 0, duration: 0.12 }, 1.2)
          .fromTo(".sw-one-flash", { scale: 0, autoAlpha: 1 }, { scale: 3.5, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 1.2)
          .fromTo(".sw-one-center", { scale: 0, rotate: -180, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.4)" }, 1.22)
          .to(
            frame.current,
            {
              p: 1,
              duration: 1,
              onUpdate: () => {
                const a = mandala.current;
                if (a) a.goToAndStop(frame.current.p * (a.totalFrames - 1), true);
                if (frame.current.p > 0.6 && !burst) {
                  burst = true;
                  hearts.current?.play();
                } else if (frame.current.p < 0.3) burst = false;
              },
            },
            1.22,
          )
          .from(".sw-one-copy > *", { yPercent: 120, autoAlpha: 0, stagger: 0.1, duration: 0.4, ease: "expo.out" }, 1.6)
          .to({}, { duration: 0.3 });
      });
    },
    { scope: root },
  );

  return (
    <section className="sw" ref={root} data-wipe>
      <div className="sw-toran" aria-hidden />
      <div className="sw-petals" aria-hidden>
        <Lottie src="/lottie/marigold-petals.json" fit="cover" />
      </div>
      <div className="sw-garland sw-garland-l" aria-hidden>
        <Image {...art("marigold-garlands")} alt="" sizes="20vw" />
      </div>
      <div className="sw-garland sw-garland-r" aria-hidden>
        <Image {...art("marigold-garlands")} alt="" sizes="20vw" />
      </div>

      <div className="sw-hello">
        <div className="sw-kalash" aria-hidden>
          <Image {...art("kalash")} alt="" sizes="140px" />
        </div>
        <div className="sw-greet" aria-live="off">
          {greetings.map((g) => (
            <div className="sw-greet-item" key={g.text}>
              <Gloss text={g.text} en={g.en} />
            </div>
          ))}
        </div>
        <div className="sw-kalash" aria-hidden>
          <Image {...art("kalash")} alt="" sizes="140px" />
        </div>
      </div>

      <div className="sw-cards">
        <span className="sw-one-flash" aria-hidden />
        <div className="sw-one-center" aria-label="One heart, two states">
          <div className="sw-one-mandala" aria-hidden>
            <Lottie src="/lottie/golden-mandala.json" autoplay={false} loop={false} onReady={onMandala} />
          </div>
          <div className="sw-one-copy">
            <AngularHeart id="sw-heart" full className="sw-one-heart" />
            <span className="hi">एक दिल</span>
            <span className="bn">এক হৃদয়</span>
            <span className="truck">One heart · Two states</span>
          </div>
          <div className="sw-one-hearts" aria-hidden>
            <HeartBurst ref={hearts} count={18} />
          </div>
        </div>
        <article className="sw-card sw-card-mithila" data-jelly>
          <div className="sw-card-art">
            <Image {...art("madhubani-roundel")} alt="Madhubani roundel of a fish and a peacock" sizes="200px" />
            <span className="sw-paag" aria-hidden>
              <Image {...art("mithila-paag")} alt="" sizes="120px" />
            </span>
          </div>
          <p className="sw-card-kicker truck">The groom&apos;s side · Mithila</p>
          <h3>{wedding.families.groom.name}</h3>
          <Gloss className="sw-card-greet" text={wedding.families.groom.greeting} en="You are all most welcome (Maithili)" />
          <p>{wedding.families.groom.line}</p>
        </article>

        <article className="sw-card sw-card-bengal" data-jelly>
          <div className="sw-card-art">
            <div className="sw-alpona" aria-hidden />
            <span className="sw-mukut" aria-hidden>
              <Image {...art("bride-mukut")} alt="" sizes="100px" />
            </span>
          </div>
          <p className="sw-card-kicker">The bride&apos;s side · Bengal</p>
          <h3>{wedding.families.bride.name}</h3>
          <Gloss className="sw-card-greet" text={wedding.families.bride.greeting} en="A warm welcome (Bengali)" />
          <p>{wedding.families.bride.line}</p>
        </article>
      </div>

      <p className="sw-note">
        Two families, four languages and one extremely loud dinner table. However you say it — you&apos;re invited.
      </p>

    </section>
  );
}
