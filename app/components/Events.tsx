"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art, type ArtName } from "../art";
import { wedding } from "../wedding";
import Lottie from "./Lottie";

const isBangla = (t: string) => /[ঀ-৿]/.test(t);

export default function Events() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".ev-track")!;
      const distance = () => track.scrollWidth - innerWidth;

      const scroller = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(".ev-progress-fill", { scaleX: self.progress }),
        },
      });

      gsap.utils.toArray<HTMLElement>(".ev-card").forEach((card) => {
        gsap.from(card, {
          rotate: 9,
          yPercent: 18,
          scale: 0.82,
          ease: "power2.out",
          scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left right", end: "left 35%", scrub: true },
        });
        const pic = card.querySelector(".ev-art-inner");
        if (pic) {
          gsap.fromTo(
            pic,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left right", end: "right left", scrub: true },
            },
          );
        }

        // Tilt on hover
        const tilt = card.querySelector<HTMLElement>(".ev-tilt")!;
        const rx = gsap.quickTo(tilt, "rotateX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(tilt, "rotateY", { duration: 0.5, ease: "power3" });
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
        });
        card.addEventListener("pointerleave", () => {
          rx(0);
          ry(0);
        });
      });

      gsap.from(".ev-intro-line > *", {
        yPercent: 110,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    },
    { scope: root },
  );

  return (
    <section className="ev" ref={root} id="events">
      <div className="ev-track">
        <div className="ev-intro">
          <div className="ev-intro-line">
            <h2 className="truck-inline">The</h2>
          </div>
          <div className="ev-intro-line">
            <h2 className="truck-inline">Line-up</h2>
          </div>
          <div className="ev-intro-line">
            <p>
              <span className="hi">कार्यक्रम</span> · <span className="bn">অনুষ্ঠানসূচি</span>
            </p>
          </div>
          <p className="ev-intro-note truck">{wedding.events.length} events · 2 states · 0 chill →</p>
        </div>

        {wedding.events.map((e, i) => (
          <article className={`ev-card ev-${e.color}`} key={e.name}>
            <div className="ev-tilt">
              <span className="ev-num truck-inline">{String(i + 1).padStart(2, "0")}</span>
              <div className="ev-art">
                {e.art.startsWith("lottie:") ? (
                  <Lottie src={`/lottie/${e.art.slice(7)}.json`} className="ev-art-lottie" />
                ) : (
                  <div className={`ev-art-inner ${(e.art as string) === "kalash" ? "ev-art-contain" : ""}`}>
                    <Image {...art(e.art as ArtName)} alt="" sizes="(max-width: 768px) 85vw, 34vw" />
                  </div>
                )}
                <span className="ev-tag truck">{e.tag}</span>
              </div>
              <div className="ev-body">
                <h3 className={isBangla(e.native) ? "bn" : "hi"}>{e.native}</h3>
                <h4 className="truck">{e.name}</h4>
                <dl>
                  <div>
                    <dt>When</dt>
                    <dd>
                      {e.date} · {e.time}
                    </dd>
                  </div>
                  <div>
                    <dt>Where</dt>
                    <dd>{e.place}</dd>
                  </div>
                </dl>
                <p>{e.blurb}</p>
              </div>
            </div>
          </article>
        ))}
        <div className="ev-end" aria-hidden>
          <Lottie src="/lottie/flower-mandala.json" />
        </div>
      </div>
      <div className="ev-progress" aria-hidden>
        <span className="ev-progress-fill" />
      </div>
    </section>
  );
}
