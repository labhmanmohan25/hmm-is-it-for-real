"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { lenisRef } from "./lenis";
import { gsap, ScrollTrigger } from "./gsap";
import Experience from "./Experience";
import Toasts from "./Toasts";
import type { StoryPhotos } from "./story/Story";

// One continuous page: hero → story → the rest of the site. No intro phase, no skip/replay buttons.
export default function Root({ photos }: { photos: StoryPhotos }) {
  // Smooth scroll + touch normalisation, shared by the whole page.
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
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

  return (
    <>
      <Experience photos={photos} />
      <Toasts />
    </>
  );
}
