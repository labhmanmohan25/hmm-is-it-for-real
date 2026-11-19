"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art } from "../../art";
import { details as wedding } from "../../../content/details";
import Lottie from "./Lottie";
import Gloss from "./Gloss";

// "Two families": the one place on the site where Mithila and Bengal are named.
export default function Swagatam() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } })
        .from(".sw-toran", { yPercent: -120, duration: 1.2, ease: "elastic.out(1, 0.5)" })
        .from(".sw-greet-one", { rotateX: -90, autoAlpha: 0, duration: 0.7, ease: "back.out(2)" }, 0.1)
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

  const g = wedding.families.groom;
  const b = wedding.families.bride;

  return (
    <section className="sw" ref={root} data-wipe>
      <div className="sw-toran" aria-hidden />
      <div className="sw-petals" aria-hidden>
        <Lottie src="/lottie/marigold-petals.json" fit="cover" />
      </div>

      <p className="sw-greet-one truck">Two families</p>

      <div className="sw-cards">
        <article className="sw-card sw-card-mithila" data-jelly>
          <div className="sw-card-art">
            <Image {...art("madhubani-roundel")} alt="Madhubani roundel of a fish and a peacock" sizes="200px" />
            <span className="sw-paag" aria-hidden>
              <Image {...art("mithila-paag")} alt="" sizes="120px" />
            </span>
          </div>
          <p className="sw-card-kicker truck">The groom&apos;s side · {g.region}</p>
          <h3>{g.name}</h3>
          <Gloss className="sw-card-greet" text={g.greeting} en={g.greetingEn} />
          <p>{g.line}</p>
        </article>

        <article className="sw-card sw-card-bengal" data-jelly>
          <div className="sw-card-art">
            <div className="sw-alpona" aria-hidden />
            <span className="sw-mukut" aria-hidden>
              <Image {...art("bride-mukut")} alt="" sizes="100px" />
            </span>
          </div>
          <p className="sw-card-kicker">The bride&apos;s side · {b.region}</p>
          <h3>{b.name}</h3>
          <Gloss className="sw-card-greet" text={b.greeting} en={b.greetingEn} />
          <p>{b.line}</p>
        </article>
      </div>

      <p className="sw-note">One extremely loud dinner table. However you say it, you&apos;re invited.</p>
    </section>
  );
}
