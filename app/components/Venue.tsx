"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { wedding } from "../wedding";
import Gloss from "./Gloss";

function downloadIcs() {
  const start = new Date(wedding.date);
  const end = new Date(start.getTime() + 5 * 3600 * 1000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const v = wedding.venue;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ApurvaWedsManmohan//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(start)}@apurva-weds-manmohan`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${wedding.bride.name} weds ${wedding.groom.name}`,
    `LOCATION:${v.name}\\, ${v.floor}\\, ${v.address.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${v.mapUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "apurva-weds-manmohan.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Venue() {
  const root = useRef<HTMLElement>(null);
  const v = wedding.venue;
  const time = new Date(wedding.date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  useGSAP(
    () => {
      // Plays once as the section arrives — no pin, so nothing is ever stuck off-screen
      gsap
        .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: root.current, start: "top 65%" } })
        // "Pudhil station: Vashi" — the announcement every Mumbaikar knows
        .from(".vn-announce .ch", { yPercent: 120, rotate: 12, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "back.out(2)" }, 0)
        .from(".vn-card", { y: 80, rotate: -2, autoAlpha: 0, duration: 1 }, 0.3);

      // Milestones pop up out of the kerb one after another
      gsap.from(".vn-stone-post", {
        yPercent: 105,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".vn-stones", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section className="vn" ref={root} id="venue">
      <header className="vn-head">
        <p className="vn-kicker truck">The venue</p>
        <h2 className="vn-announce" aria-label="Pudhil station Vashi — Next station, Vashi">
          <span className="hi" aria-hidden>
            {"पुढील स्टेशन वाशी".split(" ").map((w, i) => (
              <span className="ch" key={i}>
                {w}{" "}
              </span>
            ))}
          </span>
          <small aria-hidden>“Next station: Vashi” — as every Mumbai local announces it</small>
        </h2>
      </header>

      <article className="vn-card">
        <div className="vn-map">
          <iframe src={v.embedUrl} title={`Map of ${v.name}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        </div>
        <div className="vn-address">
          <p className="vn-when truck">
            {wedding.dateLabel} · {time}
          </p>
          <h3>{v.name}</h3>
          <p className="vn-floor">{v.floor}</p>
          <p>{v.address}</p>
          <div className="vn-actions">
            <a className="btn-truck" href={v.mapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps ↗
            </a>
            <button className="btn-truck btn-pink" onClick={downloadIcs}>
              Add to calendar
            </button>
          </div>
        </div>
      </article>

      <div className="vn-reach">
        <h3 className="vn-reach-head">
          <Gloss text="किती लांब?" en="How far is it? (Marathi)" />
          <small>Roughly, from wherever you land. Traffic permitting — it&apos;s Mumbai.</small>
        </h3>
        <ul className="vn-stones">
          {v.reach.map((r) => (
            <li className="vn-stone" key={r.code}>
              <div className="vn-stone-post" style={{ "--top": `var(--${r.top})` } as React.CSSProperties}>
                <span className="vn-stone-cap truck">{r.code}</span>
                <span className="vn-stone-body">
                  <b className="hi">{r.native}</b>
                  <span className="vn-stone-en">{r.name}</span>
                  <strong className="truck">
                    {r.km}
                    <small>km</small>
                  </strong>
                </span>
              </div>
              <p className="vn-stone-how">{r.how}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
