"use client";

import { useEffect } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { lenisRef } from "./lenis";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { art } from "../art";
import Hero from "./Hero";
import Marquee from "./Marquee";
import TwoWorlds from "./TwoWorlds";
import Events from "./Events";
import Journey from "./Journey";
import Countdown from "./Countdown";
import Rsvp from "./Rsvp";
import Footer from "./Footer";
import Swagatam from "./Swagatam";
import Venue from "./Venue";
import MumbaiPlanner from "./MumbaiPlanner";
import Narration from "./Narration";
import Courier from "./Courier";
import ClickSpark from "./ClickSpark";

export default function Experience() {
  useEffect(() => {
    history.scrollRestoration = "manual";
    // Phones scroll natively off the main thread, so a pinned section slides past its pin point and
    // snaps back a frame later; the address bar showing/hiding also re-measures every pin mid-scroll.
    // Run touch scrolling through ScrollTrigger and ignore those height-only resizes. The map keeps
    // its own drag/pinch.
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll({ allowNestedScroll: true, ignore: ".mp-map-wrap" });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useGSAP(() => {
    gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });

    // Jelly: anything marked data-jelly wobbles with scroll speed
    const jelly = gsap.utils.toArray<HTMLElement>("[data-jelly]").map((el) => gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }));
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const s = gsap.utils.clamp(-10, 10, self.getVelocity() / -250);
        jelly.forEach((q) => q(s));
      },
    });

    // Angular truck-art wipe: each flowing section cuts in over the previous one on a diagonal
    gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el) => {
      gsap.fromTo(
        el,
        // Cut depth matches the 14vh the section overlaps its predecessor ([data-wipe] in globals.css),
        // so the uncut corner always shows the previous section, never the page behind it.
        { clipPath: "polygon(0% 14vh, 100% 0%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true },
        },
      );
    });
  });

  return (
    <>
      <div className="scroll-progress" aria-hidden />
      <ClickSpark />
      <main>
        <Hero />
        <Marquee />
        <Narration
          tone="sindoor"
          aside="Ahem. Lights, camera, shaadi."
          props={[
            { art: "litti-chokha", mode: "fly", side: "left" },
            { art: "makhana", mode: "fly", side: "right" },
          ]}
        >
          From the land of litti chokha, Madhubani and makhana… came a boy who could argue about politics for six hours
          straight.
        </Narration>
        <Narration tone="ivory" aside="She won. Obviously." props={[{ art: "rosogolla", mode: "rain", count: 7 }]}>
          From the city of rosogolla, Puchka and yellow taxis… came a girl who could out-argue him in six minutes.
        </Narration>
        <Swagatam />
        <TwoWorlds />
        <Narration tone="haldi" aside="(Not really. Everyone saw it coming.)">
          What happened next shocked both families.
        </Narration>
        <Journey />
        <Narration aside="Sleep is cancelled. Dancing is mandatory.">
          And so begins a seven-event, two-culture, zero-sleep marathon.
        </Narration>
        <Events />
        <Countdown />
        <Venue />
        <Narration tone="ivory" aside="Kya bolti public?">
          Coming from outside Mumbai? Don&apos;t worry, we have planned your holiday too.
        </Narration>
        <MumbaiPlanner />
        <Narration tone="haldi" aside="Ab bas aapka intezaar hai — now we are only waiting for you.">
          Everything is ready. The band, the biryani, the dancing uncles.
        </Narration>
        <Rsvp />
      </main>
      <Footer />

      {/* Objects that travel across section boundaries, stitching the story together */}
      <Courier
        from=".sw-card-mithila .sw-card-art > img"
        to=".tw-roundel img"
        trigger=".sw"
        start="bottom 75%"
        endTrigger=".tw"
        end="top top"
        spin={360}
      >
        <Image {...art("madhubani-roundel")} alt="" sizes="40vw" className="courier-roundel-img" />
      </Courier>
      <Courier
        from=".sw-alpona"
        to=".tw-alpona"
        trigger=".sw"
        start="bottom 75%"
        endTrigger=".tw"
        end="top top"
        spin={-360}
        arc={0.3}
      >
        <div className="courier-alpona" />
      </Courier>
    </>
  );
}
