"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { lenisRef } from "./lenis";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import Hero from "./Hero";
import Crawl from "./Crawl";
import Events from "./Events";
import Journey from "./Journey";
import Countdown from "./Countdown";
import Rsvp from "./Rsvp";
import Footer from "./Footer";
import Swagatam from "./Swagatam";
import Venue from "./Venue";
import MumbaiPlanner from "./MumbaiPlanner";
import Narration from "./Narration";
import Marathon from "./Marathon";
import ClickSpark from "./ClickSpark";
import Soundtrack from "./Soundtrack";

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
      {/* a tiny nazar battu riding the front of the progress bar: kaala teeka for the website */}
      <span className="nazar" aria-hidden>
        🧿
      </span>
      <ClickSpark />
      <Soundtrack />
      <main>
        <Hero />
        <Crawl />
        <Narration
          tone="sindoor"
          aside="Ahem. Lights, camera, shaadi."
          props={[
            { art: "litti-chokha", mode: "fly", slot: "tl", w: 230 },
            { art: "makhana", mode: "fly", slot: "tr", w: 190 },
            { art: "mithila-paag", mode: "fly", slot: "ml", w: 150 },
            { art: "madhubani-roundel", mode: "fly", slot: "mr", w: 150, round: true },
            { art: "thekua", mode: "fly", slot: "bl", w: 190 },
            { art: "madhubani-peacock", mode: "fly", slot: "br", w: 82 },
          ]}
          show
        >
          From the land of litti chokha, Madhubani and makhana… came a boy who could talk about absolutely random stuff
          for six hours straight.
        </Narration>
        <Narration tone="ivory" aside="The only one who never hit mute. Not once." props={[
            { art: "puchka", mode: "fly", slot: "tl", w: 220 },
            { art: "mishti-doi", mode: "fly", slot: "tr", w: 180 },
            { art: "kalighat-cat-fish", mode: "fly", slot: "ml", w: 110 },
            { art: "rosogolla", mode: "fly", slot: "mr", w: 160 },
            { art: "jhalmuri", mode: "fly", slot: "bl", w: 150 },
            { art: "macher-jhol", mode: "fly", slot: "br", w: 230 },
          ]}
          show>
          From the city of rosogolla, puchka and macher jhol… came a girl who listened to every single minute of it. Till
          the very end.
        </Narration>
        <Swagatam />
        <Journey />
        <Marathon />
        <Events />
        <Countdown />
        <Venue />
        <MumbaiPlanner />
        <Rsvp />
      </main>
      <Footer />

    </>
  );
}
