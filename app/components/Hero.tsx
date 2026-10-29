"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "./gsap";
import { lenisRef } from "./lenis";
import { art } from "../art";
import { wedding } from "../wedding";
import GeoPetals from "./GeoPetals";
import Gloss from "./Gloss";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chars = gsap.utils
        .toArray<HTMLElement>(".hero-name")
        .flatMap((el) => SplitText.create(el, { type: "chars", charsClass: "ch" }).chars);

      gsap.to(".hero-rays", { rotate: 360, duration: 80, repeat: -1, ease: "none" });
      gsap.to(".hero-alpona-spin", { rotate: -360, duration: 140, repeat: -1, ease: "none" });

      // Entrance — runs straight away on hydration (no loader). Everything is pre-hidden by CSS
      // under html.js so there is no flash of the final state.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .set(".hero-copy, .hero-side, .hero-alpona, .hero-toran", { visibility: "visible" })
        .from(".hero-alpona", { scale: 0.2, rotate: -140, opacity: 0, duration: 2 }, 0)
        .from(".hero-toran", { yPercent: -120, duration: 1.4, ease: "elastic.out(1, 0.45)" }, 0.1)
        .from(
          chars,
          {
            yPercent: 140,
            rotateX: -90,
            rotate: () => gsap.utils.random(-35, 35),
            opacity: 0,
            duration: 1.2,
            stagger: { each: 0.035, from: "center" },
          },
          0.15,
        )
        .from(".hero-reveal", { autoAlpha: 0, y: 40, duration: 1, stagger: 0.08 }, 0.5)
        .from(".hero-side-l .hero-side-in", { autoAlpha: 0, xPercent: -90, rotate: -35, duration: 1.6 }, 0.35)
        .from(".hero-side-r .hero-side-in", { autoAlpha: 0, xPercent: 90, rotate: 35, duration: 1.6 }, 0.35)
        // The crowns drop from the sky onto the first letters and keep wobbling
        .from(".crown", { yPercent: -500, rotate: (i) => (i ? 50 : -50), autoAlpha: 0, duration: 1.1, ease: "bounce.out", stagger: 0.25 }, 1)
        .add(() => {
          gsap.to(".crown-bride", { rotate: 6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
          gsap.to(".crown-groom", { rotate: -8, y: -6, duration: 0.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        });

      // Scroll: zoom-through — one flick of the wheel plays the whole thing. The alpona swallows the
      // screen, sindoor blooms out of its centre, and the page glides on into the (also sindoor) marquee.
      const tl = gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=60%", pin: true, scrub: 0.3 },
        })
        .to(".hero-alpona", { scale: 7.5, ease: "power2.in", duration: 0.6 }, 0)
        .to(".hero-rays", { scale: 2.4, ease: "none", duration: 0.6 }, 0)
        .to(".hero-copy", { scale: 0.55, autoAlpha: 0, filter: "blur(14px)", ease: "power1.in", duration: 0.35 }, 0)
        .to(".hero-side-l", { xPercent: -170, yPercent: -30, rotate: -40, ease: "power2.in", duration: 0.45 }, 0)
        .to(".hero-side-r", { xPercent: 170, yPercent: -30, rotate: 40, ease: "power2.in", duration: 0.45 }, 0)
        .to(".hero-toran", { yPercent: -130, ease: "power2.in", duration: 0.4 }, 0)
        .fromTo(".hero-flash", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power3.in", duration: 0.4 }, 0.2);

      // Anywhere between the top and the marquee, any scroll is taken as "go there": glide all the way.
      const target = () => tl.scrollTrigger!.end + root.current!.offsetHeight;
      let gliding = false;
      const glide = (to: number) => {
        gliding = true;
        const lenis = lenisRef.current;
        if (!lenis) {
          window.scrollTo({ top: to, behavior: "smooth" });
          gsap.delayedCall(1.2, () => (gliding = false));
          return;
        }
        lenis.scrollTo(to, {
          duration: 1.3,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          force: true,
          onComplete: () => (gliding = false),
        });
      };
      ScrollTrigger.create({
        start: 1,
        end: () => target() - 1,
        onUpdate: (self) => {
          if (!gliding) glide(self.direction > 0 ? target() : 0);
        },
      });

      // Mouse parallax on art layers (separate wrappers so it never fights the scroll tweens)
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.depth * 60);
          l.y(ny * l.depth * 60);
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <section className="hero" ref={root}>
      <div className="hero-rays" aria-hidden />
      <div className="hero-glow" aria-hidden />

      <div className="hero-alpona" aria-hidden>
        <div data-depth="0.25">
          <div className="hero-alpona-spin">
            <Image {...art("alpona-peacock")} alt="" priority fetchPriority="high" sizes="90vmin" />
          </div>
        </div>
      </div>

      <div className="hero-side hero-side-l">
        <div className="hero-side-in">
          <div data-depth="1">
            <figure className="sticker sticker-green" data-jelly>
              <Image {...art("madhubani-peacock")} alt="Madhubani peacock painting from Mithila, Bihar" priority sizes="22vw" />
              <figcaption className="truck">Mithila</figcaption>
            </figure>
          </div>
        </div>
      </div>
      <div className="hero-side hero-side-r">
        <div className="hero-side-in">
          <div data-depth="-1">
            <figure className="sticker sticker-red" data-jelly>
              <Image {...art("kalighat-lady-fish")} alt="Kalighat painting of a woman holding a fish, Bengal" priority sizes="22vw" />
              <figcaption className="truck">Bengal</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <GeoPetals className="hero-petals" />

      <div className="hero-toran" aria-hidden />

      <div className="hero-copy">
        <p className="hero-reveal hero-mantra">
          <Gloss text="॥ श्री गणेशाय नमः ॥" en="Shri Ganeshaya Namah · may all begin well" />
        </p>
        <p className="hero-reveal hero-kicker truck">
          Bengal <span>×</span> Mithila
        </p>
        <h1 className="hero-names">
          <span className="hero-name-wrap">
            <span className="crown crown-bride" aria-hidden>
              <Image {...art("bride-mukut")} alt="" priority sizes="140px" />
            </span>
            <span className="hero-name truck-inline">{wedding.bride.name}</span>
          </span>
          <span className="hero-reveal hero-amp">weds</span>
          <span className="hero-name-wrap">
            <span className="crown crown-groom" aria-hidden>
              <Image {...art("groom-mukut")} alt="" priority sizes="160px" />
            </span>
            <span className="hero-name truck-inline">{wedding.groom.name}</span>
          </span>
        </h1>
        <p className="hero-reveal hero-native">
          <Gloss text={wedding.bride.native} en={`${wedding.bride.name} in Bengali`} />
          <i>✦</i>
          <Gloss text={wedding.groom.native} en={`${wedding.groom.name} in Maithili`} />
        </p>
        <p className="hero-reveal hero-date truck">
          {wedding.dateLabel} <span>·</span> Vashi, Navi Mumbai
        </p>
      </div>
      <div className="hero-flash" aria-hidden />
    </section>
  );
}
