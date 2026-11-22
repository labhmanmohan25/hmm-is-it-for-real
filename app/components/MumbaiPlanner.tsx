"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { days as allDays, ours, type Day, type Stop } from "../mumbai";
import { wedding } from "../wedding";
import SectionIntro from "./SectionIntro";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="mp-map mp-map-loading truck">Loading Mumbai…</div>,
});

// Day picker = Mumbai local train tickets
const tickets = [
  { n: 1, word: "Ek din", line: "Bas ghoomna hai", route: "CSMT ⇄ Colaba", cls: "tk-pink" },
  { n: 2, word: "Do din", line: "Thoda relax", route: "Bandra ⇄ Juhu", cls: "tk-green" },
  { n: 3, word: "Teen din", line: "Full Mumbaikar", route: "Dadar ⇄ Girgaon", cls: "tk-yellow" },
  { n: 4, word: "Chaar din", line: "Ghar le lo yahin", route: "Vashi ⇄ Nerul", cls: "tk-blue" },
];

function directionsUrl(day: Day) {
  const q = (s: string) => encodeURIComponent(`${s}, Mumbai`);
  const [first, ...rest] = day.stops;
  const last = rest.pop() ?? first;
  const waypoints = rest.map((s) => q(s.q)).join("%7C");
  return `https://www.google.com/maps/dir/?api=1&origin=${q(first.q)}&destination=${q(last.q)}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=driving`;
}

const icon = (s: Stop) => (s.kind === "eat" ? "🍛 " : s.kind === "us" ? "★ " : "📍 ");

function placeUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q}, Mumbai`)}`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function downloadKml(days: Day[], file: string) {
  const v = wedding.venue;
  const folders = days
    .map(
      (d, i) => `<Folder><name>${d.noRoute ? esc(d.title) : `Day ${i + 1}: ${esc(d.title)}`}</name>${d.stops
        .filter((s) => s.lat != null && s.lng != null)
        .map(
          (s, j) =>
            `<Placemark><name>${d.noRoute ? "" : `${i + 1}.${j + 1} `}${esc(s.name)}</name><description>${esc(s.tip)}</description><Point><coordinates>${s.lng},${s.lat},0</coordinates></Point></Placemark>`,
        )
        .join("")}</Folder>`,
    )
    .join("");
  const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Apurva weds Manmohan — Mumbai trip</name><Placemark><name>💍 The wedding — ${esc(v.name)}</name><description>${esc(`${v.floor}, ${v.address}`)}</description><Point><coordinates>${v.lng},${v.lat},0</coordinates></Point></Placemark>${folders}</Document></kml>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([kml], { type: "application/vnd.google-earth.kml+xml" }));
  a.download = `${file}.kml`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function MumbaiPlanner() {
  const root = useRef<HTMLElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  // 1–4 = that many itinerary days; 0 = our own favourite spots
  const [count, setCount] = useState(2);
  const [saving, setSaving] = useState(false);
  const days = useMemo(() => (count === 0 ? [ours] : allDays.slice(0, count)), [count]);
  const file = count === 0 ? "apurva-manmohan-mumbai" : `mumbai-${count}-day-plan`;
  const [nearMap, setNearMap] = useState(false);

  // Leaflet + tiles are only fetched once the planner is about to scroll into view
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNearMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      gsap.from(".mp-title > *", {
        yPercent: 120,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".mp-title", start: "top 85%" },
      });
      gsap.from(".mp-strip img", {
        y: 80,
        rotate: (i) => (i % 2 ? 8 : -8),
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: ".mp-strip", start: "top 85%" },
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.from(".mp-day", { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" });
      // each day's rail draws down, then its stations pop on one by one
      gsap.fromTo(".mp-line", { "--rail": 0 }, { "--rail": 1, duration: 1.1, ease: "power2.inOut", stagger: 0.12 });
      gsap.from(".mp-stop", { x: -24, autoAlpha: 0, duration: 0.35, stagger: 0.04, ease: "back.out(2)", delay: 0.15 });
      // only the chosen ticket is punched and stamped; clear the rest first
      gsap.set(".tk:not(.on) .tk-stamp", { autoAlpha: 0 });
      gsap.set(".tk:not(.on) .tk-punch", { scale: 0 });
      gsap.fromTo(".tk.on", { rotate: -6, scale: 1.12 }, { rotate: 0, scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" });
      gsap.fromTo(".tk.on .tk-stamp", { scale: 3, autoAlpha: 0, rotate: -30 }, { scale: 1, autoAlpha: 1, rotate: -14, duration: 0.25, ease: "power4.in" });
      gsap.fromTo(".tk.on .tk-punch", { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)", delay: 0.1 });
    },
    { scope: root, dependencies: [count] },
  );

  const savePng = async () => {
    if (!poster.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(poster.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#fff3dc" });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mp" ref={root} id="mumbai" data-wipe>
      <SectionIntro className="mp-intro" aside="Kya bolti public?">
        Coming from outside Mumbai? Don&apos;t worry, we have planned your holiday too.
      </SectionIntro>

      <div className="mp-strip" aria-hidden>
        <Image {...art("gateway")} alt="" sizes="30vw" />
        <Image {...art("local-train")} alt="" sizes="30vw" />
        <Image {...art("sea-link")} alt="" sizes="30vw" />
      </div>

      <h2 className="mp-title">
        <span className="truck-inline">Aamchi Mumbai</span>
      </h2>

      <div className="mp-picker" role="tablist" aria-label="How many days are you staying?">
        {tickets.map((t) => (
          <button
            key={t.n}
            role="tab"
            aria-selected={count === t.n}
            className={`tk ${t.cls} ${count === t.n ? "on" : ""}`}
            onClick={() => setCount(t.n)}
          >
            <span className="tk-head">Mumbai Local · II Class</span>
            <b className="truck">{t.n}</b>
            <span className="tk-word">{t.word}</span>
            <small className="tk-line">“{t.line}”</small>
            <span className="tk-route">{t.route}</span>
            <span className="tk-punch" aria-hidden />
            <span className="tk-stamp truck" aria-hidden>
              Booked
            </span>
          </button>
        ))}
        <button role="tab" aria-selected={count === 0} className={`tk tk-ours ${count === 0 ? "on" : ""}`} onClick={() => setCount(0)}>
          <span className="tk-head">VIP Pass · I Class</span>
          <b className="truck">★</b>
          <span className="tk-word">Our spots</span>
          <small className="tk-line">“Humare adde”</small>
          <span className="tk-route">Khandeshwar ⇄ Bandstand</span>
          <span className="tk-punch" aria-hidden />
          <span className="tk-stamp truck" aria-hidden>
            Booked
          </span>
        </button>
      </div>

      <div className="mp-poster" ref={poster}>
        <div className="mp-poster-head">
          <div className="mp-board">
            <span className="hi">मुंबई</span>
            <b className="truck">{count === 0 ? "Our Mumbai" : "Mumbai"}</b>
            <span className="mp-board-days truck">{count === 0 ? "★ adde" : `${count} din`}</span>
          </div>
          <span className="mp-poster-note">{wedding.hashtag} · 💍 = the wedding venue, Vashi</span>
        </div>
        <div className="mp-body">
          <div className="mp-map-wrap" data-lenis-prevent>
            {nearMap ? <MapView days={days} /> : <div className="mp-map mp-map-loading truck">Loading Mumbai…</div>}
          </div>
          <div className="mp-days">
            {days.map((d, i) => (
              <article className="mp-day" key={d.title} style={{ ["--c" as string]: d.color }}>
                <header>
                  <b className="truck">{d.noRoute ? "★" : `Day ${i + 1}`}</b>
                  <span>{d.title}</span>
                  {!d.noRoute && (
                    <a className="mp-route" href={directionsUrl(d)} target="_blank" rel="noreferrer">
                      Route in Google Maps ↗
                    </a>
                  )}
                </header>
                <ol className="mp-line">
                  {d.stops.map((s, j) => (
                    <li key={s.name} className={`mp-stop mp-${s.kind}`}>
                      <span className="mp-n">{d.noRoute ? j + 1 : `${i + 1}.${j + 1}`}</span>
                      <div>
                        <a href={placeUrl(s.q)} target="_blank" rel="noreferrer">
                          {icon(s)}
                          {s.name}
                        </a>
                        <small>{s.tip}</small>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mp-actions">
        <button className="btn-truck" onClick={savePng} disabled={saving}>
          {saving ? "Saving…" : "Download as image 🖼"}
        </button>
        <button className="btn-truck btn-pink" onClick={() => downloadKml(days, file)}>
          Download for Google My Maps 🗺
        </button>
      </div>
      <p className="mp-help">
        To get every pin on your phone: open{" "}
        <a href="https://www.google.com/maps/d/" target="_blank" rel="noreferrer">
          Google My Maps
        </a>{" "}
        → Create new map → Import → choose the downloaded file. It then shows up under Saved → Maps in the Google Maps
        app.
      </p>
    </section>
  );
}
