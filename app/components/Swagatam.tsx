"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { wedding } from "../wedding";
import Lottie from "./Lottie";
import Gloss from "./Gloss";

const greetings = [
  { text: "स्वागत अछि", en: "Welcome — in Maithili, the groom's mother tongue" },
  { text: "স্বাগতম", en: "Welcome — in Bengali, the bride's mother tongue" },
  { text: "स्वागत आहे", en: "Welcome — in Marathi, because Mumbai is home" },
  { text: "स्वागतम्", en: "Welcome — in Sanskrit, because why not all of them" },
];

export default function Swagatam() {
  const root = useRef<HTMLElement>(null);

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

      gsap.timeline({
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
        .from(".sw-card-mithila", { x: "-60vw", rotate: -25, duration: 1.3, ease: "expo.out" }, 0.1)
        .from(".sw-card-bengal", { x: "60vw", rotate: 25, duration: 1.3, ease: "expo.out" }, 0.1)
        .from(".sw-note", { y: 40, autoAlpha: 0, duration: 0.8 }, 0.6);

      gsap.to(".sw-paag", { rotate: 10, y: -8, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".sw-mukut", { rotate: 6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".sw-alpona", {
        rotate: 180,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
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

      <div className="sw-greet" aria-live="off">
        {greetings.map((g) => (
          <div className="sw-greet-item" key={g.text}>
            <Gloss text={g.text} en={g.en} />
          </div>
        ))}
      </div>

      <div className="sw-cards">
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
