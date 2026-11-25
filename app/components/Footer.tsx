"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import Image from "next/image";
import { art, type ArtName } from "../art";
import credits from "../credits.json";
import NewsTicker from "./NewsTicker";

// Kathputli baraat: real Rajasthani puppet photos (Wikimedia Commons, cut out), repeated into a long
// row of dancers along the bottom of the page. The row stays put; each puppet dances on its own.
const troupe: ArtName[] = ["puppet-camel", "puppet-dancer", "puppet-pair-a", "puppet-couple", "puppet-pair-b"];
const baraat = Array.from({ length: 10 }, (_, i) => ({
  art: troupe[i % troupe.length],
  flip: i % 4 === 1,
  size: [1, 0.82, 0.92, 0.76, 0.88][i % 5],
}));

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Kathputli dance: every puppet hangs from its strings (pivot at the top) and, on each beat of an
      // imaginary dhol, picks its next move: swing, twirl, hop, shimmy or a bow. Nobody moves in sync.
      const BEAT = 0.42;
      const moves: ((el: HTMLElement) => gsap.core.Timeline)[] = [
        // swing like a pendulum on the strings
        (el) => {
          const a = gsap.utils.random(14, 26) * (Math.random() < 0.5 ? -1 : 1);
          return gsap
            .timeline()
            .to(el, { rotate: a, duration: BEAT, ease: "sine.out" })
            .to(el, { rotate: -a * 0.7, duration: BEAT, ease: "sine.inOut" })
            .to(el, { rotate: 0, duration: BEAT * 0.8, ease: "sine.in" });
        },
        // full twirl
        (el) =>
          gsap
            .timeline()
            .to(el, { y: -18, duration: BEAT * 0.4, ease: "power2.out" })
            .to(el, { rotationY: "+=360", duration: BEAT * 1.6, ease: "power2.inOut" }, 0)
            .to(el, { y: 0, duration: BEAT * 0.5, ease: "bounce.out" }),
        // two springy hops with a squash on landing
        (el) => {
          const tl = gsap.timeline();
          for (let k = 0; k < 2; k++) {
            tl.to(el, { y: -gsap.utils.random(22, 44), scaleY: 1.06, rotate: gsap.utils.random(-8, 8), duration: BEAT * 0.45, ease: "power2.out" })
              .to(el, { y: 0, scaleY: 0.9, duration: BEAT * 0.4, ease: "power2.in" })
              .to(el, { scaleY: 1, rotate: 0, duration: BEAT * 0.15 });
          }
          return tl;
        },
        // shimmy: quick side-to-side jiggle with a skew
        (el) =>
          gsap
            .timeline()
            .to(el, { x: 9, skewX: -8, duration: BEAT / 4, repeat: 5, yoyo: true, ease: "sine.inOut" })
            .to(el, { x: 0, skewX: 0, duration: BEAT / 4 }),
        // bow to the audience, then pop back up
        (el) =>
          gsap
            .timeline()
            .to(el, { rotate: Math.random() < 0.5 ? 22 : -22, scaleY: 0.9, duration: BEAT * 0.7, ease: "power2.out" })
            .to(el, { rotate: 0, scaleY: 1.05, y: -14, duration: BEAT * 0.5, ease: "back.out(3)" })
            .to(el, { y: 0, scaleY: 1, duration: BEAT * 0.4, ease: "bounce.out" }),
      ];
      gsap.utils.toArray<HTMLElement>(".ft-puppet").forEach((el) => {
        gsap.set(el, { transformOrigin: "50% 0%", transformPerspective: 600 });
        const dance = () => moves[Math.floor(Math.random() * moves.length)](el).eventCallback("onComplete", dance);
        gsap.delayedCall(Math.random() * BEAT * 3, dance);
      });
    },
    { scope: root },
  );

  return (
    <footer className="ft" ref={root} data-wipe>
      <div className="ft-toran" aria-hidden />

      <div className="ft-news">
        <NewsTicker
          label="Breaking"
          items={["शुभ विवाह (Shubh Vivah)", "শুভ বিবাহ (Shubho Bibaho)", "Apurva weds Manmohan", "17 & 18 January", "Shaadi in Aamchi Mumbai"]}
        />
        <NewsTicker
          label="From Mumbai"
          tone="lime"
          speed={-0.01}
          items={["Haldi", "Mehendi", "Baraat", "Vada Pav", "Cutting Chai", "Horn OK Please", "Ganpati Bappa Morya"]}
        />
      </div>

      <div className="ft-baraat" aria-label="A baraat of dancing Rajasthani kathputli puppets">
        <div className="ft-baraat-track" aria-hidden>
          {baraat.map((p, i) => (
            <span className="ft-puppet" key={i} style={{ "--s": p.size, "--flip": p.flip ? -1 : 1 } as React.CSSProperties}>
              <Image {...art(p.art)} alt="" sizes="160px" />
            </span>
          ))}
        </div>
      </div>

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
