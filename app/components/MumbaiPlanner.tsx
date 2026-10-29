"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art } from "../art";
import { days as allDays, type Day } from "../mumbai";
import { wedding } from "../wedding";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="mp-map mp-map-loading truck">Loading Mumbai…</div>,
});

const dayWords = ["Ek din", "Do din", "Teen din", "Chaar din"];

function directionsUrl(day: Day) {
  const q = (s: string) => encodeURIComponent(`${s}, Mumbai`);
  const [first, ...rest] = day.stops;
  const last = rest.pop() ?? first;
  const waypoints = rest.map((s) => q(s.q)).join("%7C");
  return `https://www.google.com/maps/dir/?api=1&origin=${q(first.q)}&destination=${q(last.q)}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=driving`;
}

function placeUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q}, Mumbai`)}`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function downloadKml(days: Day[]) {
  const v = wedding.venue;
  const folders = days
    .map(
      (d, i) => `<Folder><name>Day ${i + 1}: ${esc(d.title)}</name>${d.stops
        .map(
          (s, j) =>
            `<Placemark><name>${i + 1}.${j + 1} ${esc(s.name)}</name><description>${s.kind === "eat" ? "Eat: " : "See: "}${esc(s.tip)}</description><Point><coordinates>${s.lng},${s.lat},0</coordinates></Point></Placemark>`,
        )
        .join("")}</Folder>`,
    )
    .join("");
  const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Apurva weds Manmohan — Mumbai trip</name><Placemark><name>💍 The wedding — ${esc(v.name)}</name><description>${esc(`${v.floor}, ${v.address}`)}</description><Point><coordinates>${v.lng},${v.lat},0</coordinates></Point></Placemark>${folders}</Document></kml>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([kml], { type: "application/vnd.google-earth.kml+xml" }));
  a.download = `mumbai-${days.length}-day-plan.kml`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function MumbaiPlanner() {
  const root = useRef<HTMLElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(2);
  const [saving, setSaving] = useState(false);
  const days = useMemo(() => allDays.slice(0, count), [count]);
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
        scrollTrigger: { trigger: root.current, start: "top 70%" },
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
      a.download = `mumbai-${count}-day-plan.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mp" ref={root} id="mumbai" data-wipe>
      <div className="mp-strip" aria-hidden>
        <Image {...art("gateway")} alt="" sizes="30vw" />
        <Image {...art("local-train")} alt="" sizes="30vw" />
        <Image {...art("sea-link")} alt="" sizes="30vw" />
      </div>

      <h2 className="mp-title">
        <span className="truck-inline">Aamchi Mumbai</span>
        <span className="mp-sub">
          Coming from outside? Stay a few extra days. Here&apos;s the family-approved plan.
        </span>
      </h2>

      <div className="mp-picker" role="tablist" aria-label="How many days are you staying?">
        {dayWords.map((w, i) => (
          <button key={w} role="tab" aria-selected={count === i + 1} className={count === i + 1 ? "on" : ""} onClick={() => setCount(i + 1)}>
            <b className="truck">{i + 1}</b>
            <span>{w}</span>
            <small>{i + 1 === 1 ? "1 day" : `${i + 1} days`}</small>
          </button>
        ))}
      </div>

      <div className="mp-poster" ref={poster}>
        <div className="mp-poster-head">
          <span className="truck">Mumbai in {count} {count === 1 ? "day" : "days"}</span>
          <span>{wedding.hashtag} · 💍 = the wedding venue, Vashi</span>
        </div>
        <div className="mp-body">
          <div className="mp-map-wrap" data-lenis-prevent>
            {nearMap ? <MapView days={days} /> : <div className="mp-map mp-map-loading truck">Loading Mumbai…</div>}
          </div>
          <div className="mp-days">
            {days.map((d, i) => (
              <article className="mp-day" key={d.title} style={{ ["--c" as string]: d.color }}>
                <header>
                  <b className="truck">Day {i + 1}</b>
                  <span>{d.title}</span>
                  <a className="mp-route" href={directionsUrl(d)} target="_blank" rel="noreferrer">
                    Route in Google Maps ↗
                  </a>
                </header>
                <ol>
                  {d.stops.map((s, j) => (
                    <li key={s.name} className={`mp-stop mp-${s.kind}`}>
                      <span className="mp-n">
                        {i + 1}.{j + 1}
                      </span>
                      <div>
                        <a href={placeUrl(s.q)} target="_blank" rel="noreferrer">
                          {s.kind === "eat" ? "🍛 " : "📍 "}
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
        <button className="btn-truck btn-pink" onClick={() => downloadKml(days)}>
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
