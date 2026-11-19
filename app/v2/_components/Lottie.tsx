"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

type Props = {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  fit?: "contain" | "cover";
  className?: string;
  // Called once the animation is ready; use it to drive frames from scroll.
  onReady?: (anim: AnimationItem) => void;
};

// Nothing (player or JSON) is downloaded until the box is within ~1 screen of the viewport.
export default function Lottie({
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  fit = "contain",
  className,
  onReady,
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let anim: AnimationItem | undefined;
    let visible = false;
    let started = false;

    const load = async () => {
      started = true;
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch(src).then((r) => r.json()),
      ]);
      if (!box.current) return;
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop,
        autoplay: false,
        animationData: data,
        rendererSettings: {
          preserveAspectRatio: fit === "cover" ? "xMidYMid slice" : "xMidYMid meet",
          progressiveLoad: true,
        },
      });
      anim.setSpeed(speed);
      anim.addEventListener("DOMLoaded", () => {
        onReadyRef.current?.(anim!);
        if (autoplay && visible) anim?.play();
      });
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) load();
      },
      { rootMargin: "100% 0px" },
    );
    const onScreen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!autoplay || !anim) return;
      if (visible) anim.play();
      else anim.pause();
    });
    near.observe(el);
    onScreen.observe(el);

    return () => {
      near.disconnect();
      onScreen.disconnect();
      anim?.destroy();
    };
  }, [src, loop, autoplay, speed, fit]);

  return <div ref={box} className={className} aria-hidden />;
}
