// The site's soundtrack: one track per section, crossfaded as you scroll (a running mashup).
//
// To change music, drop files into /public/audio and change `src` (m4a or mp3). Keep them
// light for phones: mono, ~32–64 kbps is plenty for this site.
// Sections that share a `src` keep the same track playing instead of restarting it.
// `cue` plays once, on top of the music, the first time a section is reached: e.g. record
// yourselves saying "Chal jaldi, Panvel nikalna hai!" and set cue: "/audio/chal-jaldi.m4a".

export type Track = {
  section: string; // CSS selector of the section
  src: string;
  title: string; // shown as "now playing"
  volume?: number; // 0–1, default 0.6
  cue?: string;
  seamless?: boolean; // short loop: decoded and looped gap-free (keep these files small)
  loopFrom?: number; // seamless only: seconds where repeats restart (first play always starts at 0)
  once?: boolean; // play through to the end a single time (never clipped), then fall back to DEFAULT
};

// Default for every section: the first 18 seconds of "London Thumakda" (Labh Janjua, Sonu Kakkar,
// Neha Kakkar). The file is 0:00–0:18 plus a 2-second blend back into the opening; the first play
// starts at 0:00 and repeats loop from 2 s, so the wrap flows on instead of jumping.
export const DEFAULT_TRACK = {
  src: "/audio/thumakda-loop-lite.m4a",
  title: "London Thumakda · Labh Janjua, Sonu Kakkar, Neha Kakkar",
  volume: 0.6,
  seamless: true,
  loopFrom: 2,
};

export const soundtrack: Track[] = [
  { section: ".hero", ...DEFAULT_TRACK },
  { section: ".oc", src: "/audio/star-wars-lite.m4a", title: "Star Wars main theme · John Williams", volume: 0.7 },
  { section: ".nr", ...DEFAULT_TRACK },
  { section: ".sw", ...DEFAULT_TRACK },
  { section: ".jr", src: "/audio/sneaky-snitch-lite.m4a", title: "Sneaky Snitch · Kevin MacLeod" },
  { section: ".mr", ...DEFAULT_TRACK },
  { section: ".ev", ...DEFAULT_TRACK },
  { section: ".cd", ...DEFAULT_TRACK },
  { section: ".vn", ...DEFAULT_TRACK },
  { section: ".mp", ...DEFAULT_TRACK },
  // the John Cena prank call plays in full on the RSVP; scroll away and it fades (and picks up
  // where it left off if you come back); once it has finished, the default loop takes over
  { section: ".rs", src: "/audio/john-cena-call-lite.m4a", title: "John Cena prank call", volume: 0.9, once: true },
  { section: ".ft", ...DEFAULT_TRACK },
];
