"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP } from "./gsap";
import { art } from "../../art";
import { days as allDays, type Stop } from "../_lib/mumbai";
import { details as wedding, isTodo } from "../../../content/details";
import { useTrip } from "../_lib/store";
import { addDays, diffDays, pretty } from "../_lib/dates";
import type { MapGroup } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="mp-map mp-map-loading truck">Loading Mumbai…</div>,
});

const dayWords = ["Ek din", "Do din", "Teen din", "Chaar din"];
type Position = "start" | "middle" | "end";
const POSITIONS: { id: Position; label: string; hint: string }[] = [
  { id: "start", label: "Start", hint: "Wedding first, Mumbai after" },
  { id: "middle", label: "Middle", hint: "Mumbai before and after" },
  { id: "end", label: "End", hint: "Mumbai first, wedding last" },
];

const [W1, W2] = wedding.weddingDays;
const OURS_COLOR = "#ffb703";

type Slot = { date: string; kind: "wedding" } | { date: string; kind: "city"; n: number; day: (typeof allDays)[number] };

function buildPlan(count: number, position: Position, before: number | null): Slot[] {
  const b = position === "start" ? 0 : position === "end" ? count : before !== null && before > 0 && before < count ? before : Math.floor(count / 2);
  const dates = [
    ...Array.from({ length: b }, (_, i) => addDays(W1, i - b)),
    ...Array.from({ length: count - b }, (_, i) => addDays(W2, i + 1)),
  ];
  const city: Slot[] = dates.map((date, i) => ({ date, kind: "city", n: i + 1, day: allDays[i] }));
  const wed: Slot[] = [
    { date: W1, kind: "wedding" },
    { date: W2, kind: "wedding" },
  ];
  return [...city, ...wed].sort((x, y) => (x.date < y.date ? -1 : 1));
}

function directionsUrl(stops: Stop[]) {
  const q = (s: string) => encodeURIComponent(`${s}, Mumbai`);
  const [first, ...rest] = stops;
  const last = rest.pop() ?? first;
  const waypoints = rest.map((s) => q(s.q)).join("%7C");
  return `https://www.google.com/maps/dir/?api=1&origin=${q(first.q)}&destination=${q(last.q)}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=driving`;
}

function placeUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q}, Navi Mumbai`)}`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function downloadKml(groups: MapGroup[], file: string) {
  const v = wedding.venue;
  const folders = groups
    .map(
      (g) =>
        `<Folder><name>${esc(g.title)}</name>${g.stops
          .map(
            (s, j) =>
              `<Placemark><name>${esc(g.tag)}${j + 1} ${esc(s.name)}</name><description>${s.kind === "eat" ? "Eat: " : "See: "}${esc(s.tip)}</description><Point><coordinates>${s.lng},${s.lat},0</coordinates></Point></Placemark>`,
          )
          .join("")}</Folder>`,
    )
    .join("");
  const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Apurva weds Manmohan — Mumbai trip</name><Placemark><name>💍 The wedding — ${esc(v.name)}</name><description>${esc(`${v.floor}, ${v.address}`)}</description><Point><coordinates>${v.lng},${v.lat},0</coordinates></Point></Placemark>${folders}</Document></kml>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([kml], { type: "application/vnd.google-earth.kml+xml" }));
  a.download = `${file}.kml`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function Name({ text }: { text: string }) {
  return isTodo(text) ? <span className="todo">{text}</span> : <>{text}</>;
}

export default function MumbaiPlanner() {
  const root = useRef<HTMLElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(2);
  const [position, setPosition] = useState<Position>("middle");
  const [before, setBefore] = useState<number | null>(null);
  const [fromRsvp, setFromRsvp] = useState(false);
  const [ours, setOurs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nearMap, setNearMap] = useState(false);

  // RSVP trip dates → pick the matching trip position (and day count) automatically
  const trip = useTrip();
  const [seenTrip, setSeenTrip] = useState(trip);
  if (trip !== seenTrip) {
    setSeenTrip(trip);
    if (trip) {
      const b = Math.max(0, diffDays(trip.arrive, W1));
      const a = Math.max(0, diffDays(W2, trip.leave));
      if (a + b > 0) {
        setPosition(b === 0 ? "start" : a === 0 ? "end" : "middle");
        const n = Math.min(4, a + b);
        setCount(n);
        setBefore(Math.min(b, n));
        setFromRsvp(true);
      }
    }
  }

  const plan = useMemo(() => buildPlan(count, position, before), [count, position, before]);
  const groups = useMemo<MapGroup[]>(() => {
    const cityDays = plan.filter((p): p is Extract<Slot, { kind: "city" }> => p.kind === "city");
    const g: MapGroup[] = cityDays.map((s) => ({
      id: `d${s.n}`,
      title: `Day ${s.n} (${pretty(s.date)}): ${s.day.title}`,
      tag: `${s.n}.`,
      color: s.day.color,
      route: true,
      stops: s.day.stops,
    }));
    if (ours)
      g.push({
        id: "ours",
        title: "Apurva & Manmohan's Navi Mumbai",
        tag: "★",
        color: OURS_COLOR,
        route: false,
        stops: wedding.ourPlaces.map((p) => ({ ...p, kind: "see" as const })),
      });
    return g;
  }, [plan, ours]);

  const first = plan[0].date;
  const last = plan[plan.length - 1].date;
  const fileName = `mumbai-trip-${first}-to-${last}`;

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
      gsap.from(".mp-day", { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" });
    },
    { scope: root, dependencies: [count, position, ours] },
  );

  const savePng = async () => {
    if (!poster.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(poster.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#fff3dc" });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.png`;
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
        <span className="mp-sub">Coming from outside? Stay a few extra days. Here&apos;s the family-approved plan.</span>
      </h2>

      <p className="mp-q truck">How many Mumbai days?</p>
      <div className="mp-picker" role="radiogroup" aria-label="How many days are you staying?">
        {dayWords.map((w, i) => (
          <button
            key={w}
            role="radio"
            aria-checked={count === i + 1}
            className={count === i + 1 ? "on" : ""}
            onClick={() => {
              setCount(i + 1);
              setBefore(null);
              setFromRsvp(false);
            }}
          >
            <b className="truck">{i + 1}</b>
            <span>{w}</span>
            <small>{i + 1 === 1 ? "1 day" : `${i + 1} days`}</small>
          </button>
        ))}
      </div>

      <p className="mp-q truck">Where does our wedding sit in your trip?</p>
      <div className="mp-pos" role="radiogroup" aria-label="Where does our wedding sit in your trip?">
        {POSITIONS.map((p) => (
          <button
            key={p.id}
            role="radio"
            aria-checked={position === p.id}
            className={position === p.id ? "on" : ""}
            onClick={() => {
              setPosition(p.id);
              setBefore(null);
              setFromRsvp(false);
            }}
          >
            <b className="truck">{p.label}</b>
            <small>{p.hint}</small>
          </button>
        ))}
      </div>
      {fromRsvp && trip && (
        <p className="mp-matched">
          Matched to your RSVP dates: {pretty(trip.arrive)} → {pretty(trip.leave)}
        </p>
      )}

      <button type="button" className={`mp-preset ${ours ? "on" : ""}`} aria-pressed={ours} onClick={() => setOurs((o) => !o)}>
        <span aria-hidden>★</span> Apurva &amp; Manmohan&apos;s Navi Mumbai {ours ? "· on the map" : "· add to map"}
      </button>

      <div className="mp-poster" ref={poster}>
        <div className="mp-poster-head">
          <span className="truck">
            Mumbai in {count} {count === 1 ? "day" : "days"}
          </span>
          <span>
            {pretty(first)} → {pretty(last)} · {wedding.hashtag} · 💍 = the wedding venue, Vashi
          </span>
        </div>
        <div className="mp-body">
          <div className="mp-map-wrap" data-lenis-prevent>
            {nearMap ? <MapView groups={groups} /> : <div className="mp-map mp-map-loading truck">Loading Mumbai…</div>}
          </div>
          <div className="mp-days">
            {plan.map((slot) =>
              slot.kind === "wedding" ? (
                <article className="mp-day mp-wed" key={slot.date}>
                  <header>
                    <b className="truck">{pretty(slot.date)}</b>
                    <span>Wedding day 💍</span>
                  </header>
                  <p className="mp-wed-note">
                    No sightseeing. {slot.date === W1 ? "Haldi, mehendi, sangeet." : "Baraat, jaimala, reception and the late-night vivah."}
                  </p>
                </article>
              ) : (
                <article className="mp-day" key={slot.date} style={{ ["--c" as string]: slot.day.color }}>
                  <header>
                    <b className="truck">
                      Day {slot.n} · {pretty(slot.date)}
                    </b>
                    <span>{slot.day.title}</span>
                    <a className="mp-route" href={directionsUrl(slot.day.stops)} target="_blank" rel="noreferrer">
                      Route in Google Maps ↗
                    </a>
                  </header>
                  <ol>
                    {slot.day.stops.map((s, j) => (
                      <li key={s.name} className={`mp-stop mp-${s.kind}`}>
                        <span className="mp-n">
                          {slot.n}.{j + 1}
                        </span>
                        <div>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.q}, Mumbai`)}`} target="_blank" rel="noreferrer">
                            {s.kind === "eat" ? "🍛 " : "📍 "}
                            {s.name}
                          </a>
                          <small>{s.tip}</small>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              ),
            )}
            {ours && (
              <article className="mp-day mp-ours" style={{ ["--c" as string]: OURS_COLOR }}>
                <header>
                  <b className="truck">★ Our places</b>
                  <span>Apurva &amp; Manmohan&apos;s Navi Mumbai</span>
                </header>
                <ol>
                  {wedding.ourPlaces.map((p, j) => (
                    <li key={j} className="mp-stop mp-see">
                      <span className="mp-n">★{j + 1}</span>
                      <div>
                        {isTodo(p.q) ? (
                          <span className="mp-ours-name">
                            <Name text={p.name} />
                          </span>
                        ) : (
                          <a href={placeUrl(p.q)} target="_blank" rel="noreferrer">
                            <Name text={p.name} />
                          </a>
                        )}
                        <small>{p.tip}</small>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            )}
          </div>
        </div>
      </div>

      <div className="mp-actions">
        <button className="btn-truck" onClick={savePng} disabled={saving}>
          {saving ? "Saving…" : "Download as image 🖼"}
        </button>
        <button className="btn-truck btn-pink" onClick={() => downloadKml(groups, fileName)}>
          Download for Google My Maps 🗺
        </button>
      </div>
      <p className="mp-help">
        To get every pin on your phone: open{" "}
        <a href="https://www.google.com/maps/d/" target="_blank" rel="noreferrer">
          Google My Maps
        </a>{" "}
        → Create new map → Import → choose the downloaded file. It then shows up under Saved → Maps in the Google Maps app.
      </p>
    </section>
  );
}
