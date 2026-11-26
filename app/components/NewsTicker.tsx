"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

function script(text: string) {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "truck";
}

function Item({ t }: { t: string }) {
  if (!t.includes(" (")) return <span className={script(t)}>{t}</span>;
  const [main, gloss] = t.split(" (");
  return (
    <span>
      <span className={script(main)}>{main}</span> <small className="nt-en">({gloss}</small>
    </span>
  );
}

type Tone = "sindoor" | "rani" | "lime";

// A TV-news lower third that sits on the seam between two sections. The headlines crawl, speed up
// with scroll velocity and run backwards when you scroll back up.
export default function NewsTicker({ label, items, tone = "sindoor", speed = 0.012 }: { label: string; items: string[]; tone?: Tone; speed?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".nt-track")!;
      const wrap = gsap.utils.wrap(-50, 0);
      let pos = 0;
      let boost = 0;
      let dir = 1;
      let visible = false;

      // Visibility comes from an IntersectionObserver, not ScrollTrigger start/end: this strip sits
      // at the very bottom of a page whose height keeps changing (pinned sections, the RSVP form),
      // and stale trigger positions left it thinking it was off-screen, so it never crawled.
      let slammed = false;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        // the strip slams in from the side the first time it reaches the screen
        if (visible && !slammed) {
          slammed = true;
          gsap.fromTo(root.current, { xPercent: -100 }, { xPercent: 0, duration: 0.8, ease: "power3.out" });
        }
      });
      io.observe(root.current!);

      // scroll speed and direction still steer it
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 300, 10);
        },
      });
      const tick = (_: number, dt: number) => {
        if (!visible) return;
        boost *= 0.92;
        pos = wrap(pos - speed * dir * (1 + boost) * (dt / 16.7));
        gsap.set(track, { xPercent: pos });
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        io.disconnect();
      };
    },
    { scope: root },
  );

  const row = [...items, ...items, ...items];
  return (
    <div className={`nt nt-${tone}`} ref={root} role="marquee" aria-label={`${label}: ${items.join(", ")}`}>
      <div className="nt-bug">
        <span className="nt-live">
          <i aria-hidden />
          LIVE
        </span>
        <b className="truck">{label}</b>
      </div>
      <div className="nt-rail" aria-hidden>
        <div className="nt-track">
          {[0, 1].map((copy) => (
            <div className="nt-set" key={copy}>
              {row.map((t, i) => (
                <span key={i} className="nt-item">
                  <Item t={t} />
                  <i className="nt-star">✺</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="nt-chan truck" aria-hidden>
        Shaadi
        <br />
        24×7
      </div>
    </div>
  );
}
