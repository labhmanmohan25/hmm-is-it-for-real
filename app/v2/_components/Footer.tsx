"use client";

import { details as wedding } from "../../../content/details";
import allCredits from "../../credits.json";

// Artwork v2 actually shows (the Mithila Times / Golghar / Howrah pieces left with their sections).
const USED = new Set([
  "alpona-peacock",
  "alpona-round",
  "madhubani-roundel",
  "madhubani-peacock",
  "kalighat-lady-fish",
  "kalighat-radha-krishna",
  "pata-horse-rider",
  "pata-women",
  "marigold-painting",
  "mithila-paag",
  "local-train",
  "sea-link",
  "gateway",
  "groom-mukut",
]);
const credits = allCredits.filter((c) => USED.has(c.name) || c.name.startsWith("tr-"));

export default function Footer() {
  return (
    <footer className="ft ft-slim" data-wipe>
      <div className="ft-toran" aria-hidden />

      <p className="ft-sign">
        With love from the families of <b>{wedding.bride.name}</b> &amp; <b>{wedding.groom.name}</b>
      </p>
      <p className="ft-hash truck">{wedding.hashtag}</p>

      <details className="ft-credits">
        <summary>Art credits &amp; licences</summary>
        <p>
          Paintings and photographs from Wikimedia Commons, used under their licences (some cropped / cut out,
          and composited into the trailer).
          Animations from LottieFiles (Lottie Simple License). The What to wear cards are original drawings made for this site. Our own photos are ours.
        </p>
        <ul>
          {credits.map((c) => (
            <li key={c.name}>
              <a href={c.page} target="_blank" rel="noreferrer">
                {c.title}
              </a>{" "}
              — {c.artist || "Unknown"} · {c.license}
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}
