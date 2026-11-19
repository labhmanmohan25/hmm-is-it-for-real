"use client";

import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Events from "./Events";
import Countdown from "./Countdown";
import Rsvp from "./Rsvp";
import Footer from "./Footer";
import Swagatam from "./Swagatam";
import Venue from "./Venue";
import MumbaiPlanner from "./MumbaiPlanner";
import Narration from "./Narration";
import ClickSpark from "./ClickSpark";
import WhatToWear from "./WhatToWear";
import Story, { type StoryPhotos } from "./story/Story";

export default function Experience({ photos }: { photos: StoryPhotos }) {
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
    <div className="v2">
      <div className="scroll-progress" aria-hidden />
      <nav className="v2-nav" aria-label="Site">
        <a className="v2-nav-rsvp truck" href="#rsvp">
          RSVP
        </a>
      </nav>
      <ClickSpark />
      <main>
        <Hero />
        <Story photos={photos} />
        <Marquee />
        <Swagatam />
        <Narration aside="Sleep is cancelled. Dancing is mandatory.">And so begins a six-event, zero-sleep marathon.</Narration>
        <Events />
        <WhatToWear />
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
    </div>
  );
}
