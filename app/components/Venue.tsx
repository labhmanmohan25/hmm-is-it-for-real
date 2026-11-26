"use client";

import { useRef } from "react";
import Image from "next/image";
import { art } from "../art";
import { gsap, useGSAP } from "./gsap";
import { wedding } from "../wedding";
import Gloss from "./Gloss";

type Place = (typeof wedding.places)[number];

// One .ics per place: phones open it straight into their calendar app.
function downloadIcs(p: Place) {
  const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const day = (iso: string, plus = 0) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + plus);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  };
  const { cal } = p;
  // all-day DTEND is exclusive, so the check-out day needs +1
  const when = cal.allDay
    ? [`DTSTART;VALUE=DATE:${day(cal.start)}`, `DTEND;VALUE=DATE:${day(cal.end, 1)}`]
    : [`DTSTART:${utc(new Date(cal.start))}`, `DTEND:${utc(new Date(cal.end))}`];
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ApurvaWedsManmohan//EN",
    "BEGIN:VEVENT",
    `UID:${p.key}-2027@apurva-weds-manmohan`,
    `DTSTAMP:${utc(new Date())}`,
    ...when,
    `SUMMARY:${esc(cal.title)}`,
    `LOCATION:${esc(`${p.name}, ${p.address}`)}`,
    `DESCRIPTION:${esc(`${p.note}\n${p.tip ? `${p.tip}\n` : ""}Map: ${p.mapUrl}`)}`,
    `URL:${p.mapUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = `apurva-manmohan-${p.key}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function Venue() {
  const root = useRef<HTMLElement>(null);
  const v = wedding.venue;

  useGSAP(
    () => {
      // Plays once as the section arrives — no pin, so nothing is ever stuck off-screen
      gsap
        .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: root.current, start: "top 65%" } })
        // "Pudhil station: Vashi" — the announcement every Mumbaikar knows
        .from(".vn-announce .ch", { yPercent: 120, rotate: 12, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "back.out(2)" }, 0)
        .from(".vn-place", { y: 60, rotate: (i) => (i - 1) * 4, autoAlpha: 0, stagger: 0.12, duration: 0.8 }, 0.3);

      // A local thunders through the platform as you scroll past the announcement
      gsap.fromTo(
        ".vn-train",
        { xPercent: -120, skewX: 0 },
        {
          xPercent: 120,
          ease: "none",
          scrollTrigger: { trigger: ".vn-head", start: "top 85%", end: "bottom 10%", scrub: 0.4 },
        },
      );
      gsap.to(".vn-led-track", { xPercent: -50, duration: 22, repeat: -1, ease: "none" });
      gsap.to(".vn-doors", { autoAlpha: 0.25, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });

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
        <p className="vn-kicker truck">Where &amp; when</p>
        <h2 className="vn-announce" aria-label="Pudhil station Vashi — Next station, Vashi">
          <span className="hi" aria-hidden>
            {"पुढील स्टेशन वाशी".split(" ").map((w, i) => (
              <span className="ch" key={i}>
                {w}{" "}
              </span>
            ))}
          </span>
        </h2>
        {/* the amber dot-matrix indicator above every Mumbai local's door */}
        <div className="vn-led" aria-hidden>
          <div className="vn-led-track">
            {[0, 1].map((k) => (
              <span key={k}>
                पुढील स्टेशन वाशी ✦ NEXT STATION VASHI ✦ अगला स्टेशन वाशी ✦ DOORS WILL OPEN ON THE LEFT ✦ दरवाजे डावीकडे उघडतील ✦ BARAAT
                ON PLATFORM 1 ✦&nbsp;
              </span>
            ))}
          </div>
        </div>
        <p className="vn-doors truck" aria-hidden>
          ◀ Doors will open on the left
        </p>
        <div className="vn-train" aria-hidden>
          <Image {...art("local-side")} alt="" sizes="160vw" />
        </div>
        <div className="vn-platform" aria-hidden />
      </header>

      <ul className="vn-places">
        {wedding.places.map((p) => (
          <li className={`vn-place vn-place-${p.color}`} key={p.key}>
            <div className="vn-place-media">
              {p.photo ? (
                <Image src={p.photo} alt={p.name} fill sizes="(max-width: 768px) 90vw, 33vw" className="vn-place-photo" />
              ) : null}
              <iframe
                src={p.key === "shaadi" ? v.embedUrl : `https://maps.google.com/maps?q=${encodeURIComponent(p.q)}&z=15&output=embed`}
                title={`Map of ${p.name}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
              />
              {/* the whole map is one big "open in Google Maps" tap target — no second button */}
              <a className="vn-place-maplink" href={p.mapUrl} target="_blank" rel="noreferrer" aria-label={`Open ${p.name} in Google Maps`} />
              <span className="vn-place-label truck">{p.label}</span>
            </div>
            <div className="vn-place-body">
              <p className="vn-place-when truck">{p.when}</p>
              <h3>{p.name}</h3>
              <p className="vn-place-addr">{p.address}</p>
              <p>{p.note}</p>
              {p.tip && <p className="vn-place-tip">{p.tip}</p>}
              <div className="vn-actions">
                <a className="btn-truck" href={p.mapUrl} target="_blank" rel="noreferrer">
                  Maps &amp; directions ↗
                </a>
                <button className="btn-truck btn-pink" onClick={() => downloadIcs(p)}>
                  Add to calendar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
                  <strong className={`truck ${typeof r.km === "string" ? "vn-stone-wink" : ""}`}>
                    {r.km}
                    {r.unit !== "" && <small>km</small>}
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
