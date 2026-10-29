"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import Image from "next/image";
import { art } from "../art";
import { wedding } from "../wedding";
import credits from "../credits.json";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".ft-nazar", { type: "words", wordsClass: "w" });
      gsap.from(split.words, {
        yPercent: 130,
        rotate: () => gsap.utils.random(-25, 25),
        scale: 1.6,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".ft-pandit", {
        x: "40vw",
        rotate: 25,
        duration: 1.2,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
      gsap.to(".ft-nimbu", { rotate: 12, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "50% 0%" });
    },
    { scope: root },
  );

  return (
    <footer className="ft" ref={root} data-wipe>
      <div className="ft-toran" aria-hidden />

      <div className="ft-nimbu" aria-hidden>
        <Image {...art("nimbu-mirchi")} alt="" sizes="120px" />
      </div>

      <div className="ft-pandit" data-jelly>
        <Image {...art("chhota-pandit-bb")} alt="Chhota Pandit from Bhool Bhulaiyaa" sizes="220px" />
      </div>

      <p className="ft-nazar hi">बुरी नज़र वाले तेरा मुँह काला</p>
      <p className="ft-nazar-en truck">“Evil eye, stay away!” — the nimbu-mirchi has this covered.</p>

      <p className="ft-sign">
        With love from the families of <b>{wedding.bride.name}</b> ({wedding.bride.roots}) &amp;{" "}
        <b>{wedding.groom.name}</b> ({wedding.groom.roots})
      </p>
      <p className="ft-hash truck">{wedding.hashtag}</p>

      <details className="ft-credits">
        <summary>Art credits &amp; licences</summary>
        <p>
          Paintings and photographs from Wikimedia Commons, used under their licences (some cropped / cut out).
          Animations from LottieFiles (Lottie Simple License).
        </p>
        <ul>
          {credits.map((c) => (
            <li key={c.name}>
              <a href={c.page} target="_blank" rel="noreferrer">
                {c.title}
              </a>{" "}
              — {c.artist || "Unknown"} · {c.license}
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}
