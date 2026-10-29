"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import type { AnimationItem } from "lottie-web";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import Lottie from "./Lottie";
import Gloss from "./Gloss";
import AngularHeart from "./AngularHeart";

export default function TwoWorlds() {
  const root = useRef<HTMLElement>(null);
  const mandala = useRef<AnimationItem | null>(null);
  const frame = useRef({ p: 0 });

  const onMandala = useCallback((anim: AnimationItem) => {
    mandala.current = anim;
    anim.goToAndStop(frame.current.p * (anim.totalFrames - 1), true);
  }, []);

  useGSAP(
    () => {
      // Panels slam in from the sides as the section arrives
      gsap.from(".tw-bihar", {
        xPercent: -100,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: 1 },
      });
      gsap.from(".tw-bengal", {
        xPercent: 100,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: 1 },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 1 },
      });

      tl.from(".tw-title", { yPercent: 110, rotate: 6, duration: 1, stagger: 0.15, ease: "expo.out" }, 0)
        .from(".tw-kicker, .tw-sub, .tw-couplet", { autoAlpha: 0, y: 30, stagger: 0.1, duration: 0.8 }, 0.2)
        .from(
          ".tw-card",
          {
            y: "80vh",
            rotate: (i) => (i % 2 ? 28 : -28),
            duration: 1.4,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          0.15,
        )
        .to(".tw-alpona", { rotate: 120, duration: 4, ease: "none" }, 0)
        .to(".tw-roundel", { rotate: -200, duration: 4, ease: "none" }, 0)
        // The two states lean in and the shared heart blooms between them
        .to(".tw-bihar", { xPercent: -18, rotate: -5, scale: 0.86, filter: "brightness(0.45)", duration: 1.4 }, 1.9)
        .to(".tw-bengal", { xPercent: 18, rotate: 5, scale: 0.86, filter: "brightness(0.45)", duration: 1.4 }, 1.9)
        .fromTo(
          ".tw-center",
          { scale: 0, rotate: -180, autoAlpha: 0 },
          { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.6, ease: "back.out(1.2)" },
          2.1,
        )
        .to(
          frame.current,
          {
            p: 1,
            duration: 1.9,
            ease: "none",
            onUpdate: () => {
              const a = mandala.current;
              if (a) a.goToAndStop(frame.current.p * (a.totalFrames - 1), true);
            },
          },
          2.1,
        )
        .from(".tw-center-copy > *", { yPercent: 120, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "expo.out" }, 2.8);
    },
    { scope: root },
  );

  return (
    <section className="tw" ref={root}>
      <div className="tw-panel tw-bihar">
        <Image {...art("madhubani-tree")} alt="" className="tw-bg" sizes="50vw" />
        <div className="tw-roundel" aria-hidden>
          <Image {...art("madhubani-roundel")} alt="" sizes="40vw" />
        </div>
        <div className="tw-copy">
          <p className="tw-kicker truck">The groom&apos;s side · Mithila, Bihar</p>
          <div className="tw-mask">
            <h2 className="tw-title">
              <Gloss text="मिथिला" en="Mithila" />
            </h2>
          </div>
          <p className="tw-couplet">
            <Gloss text="पग पग पोखरि माछ मखान" en="“A pond at every step, fish and makhana in every pond”" />
          </p>
          <p className="tw-sub">
            Land of Madhubani walls, Maithili songs, Chhath at dawn and litti-chokha. Volume: loud. Colours: all of them.
          </p>
        </div>
        <figure className="tw-card tw-card-a">
          <Image {...art("golghar-watercolor")} alt="1814 watercolour of the Golghar, Patna" sizes="30vw" />
          <figcaption>Golghar, Patna · 1814</figcaption>
        </figure>
      </div>

      <div className="tw-panel tw-bengal">
        <div className="tw-alpona" aria-hidden />
        <div className="tw-copy">
          <p className="tw-kicker">The bride&apos;s side · Bengal</p>
          <div className="tw-mask">
            <h2 className="tw-title">
              <Gloss text="বাংলা" en="Bangla" />
            </h2>
          </div>
          <p className="tw-couplet">
            <Gloss text="আমার সোনার বাংলা" en="“My golden Bengal” — Tagore" />
          </p>
          <p className="tw-sub">
            Land of alpona on the threshold, conch shells at dusk, Rabindra Sangeet and adda till 2am. Volume: graceful.
          </p>
        </div>
        <figure className="tw-card tw-card-b">
          <Image {...art("howrah-night")} alt="Howrah Bridge lit up at night" sizes="30vw" />
          <figcaption>Howrah Bridge · tonight</figcaption>
        </figure>
        <figure className="tw-card tw-card-c">
          <Image {...art("pata-women")} alt="Bengal patachitra of three women" sizes="24vw" />
        </figure>
      </div>

      <div className="tw-center">
        <div className="tw-mandala">
          <Lottie src="/lottie/golden-mandala.json" autoplay={false} loop={false} onReady={onMandala} />
        </div>
        <div className="tw-center-copy">
          <AngularHeart id="tw-heart" full className="tw-heart" />
          <span className="hi">एक दिल</span>
          <span className="bn">এক হৃদয়</span>
          <span className="truck">One heart · Two states</span>
        </div>
      </div>
    </section>
  );
}
