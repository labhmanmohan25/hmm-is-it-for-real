// The site's soundtrack: one track per section, crossfaded as you scroll (a running mashup).
//
// To change music, drop files into /public/audio and change `src` (m4a or mp3, ~96–128 kbps
// keeps them light).
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
};

// Default for every section: the first 18 seconds of "London Thumakda" (Labh Janjua, Sonu Kakkar,
// Neha Kakkar). The file is 0:00–0:18 plus a 2-second blend back into the opening; the first play
// starts at 0:00 and repeats loop from 2 s, so the wrap flows on instead of jumping.
const THUMAKDA = {
  src: "/audio/london-thumakda-loop-18s.m4a",
  title: "London Thumakda · Labh Janjua, Sonu Kakkar, Neha Kakkar",
  volume: 0.6,
  seamless: true,
  loopFrom: 2,
};

export const soundtrack: Track[] = [
  { section: ".hero", ...THUMAKDA },
  { section: ".oc", src: "/audio/star-wars-theme.m4a", title: "Star Wars main theme · John Williams", volume: 0.7 },
  { section: ".nr", ...THUMAKDA },
  { section: ".sw", ...THUMAKDA },
  { section: ".jr", src: "/audio/sneaky-snitch.m4a", title: "Sneaky Snitch · Kevin MacLeod" },
  { section: ".mr", ...THUMAKDA },
  { section: ".ev", ...THUMAKDA },
  { section: ".cd", ...THUMAKDA },
  { section: ".vn", ...THUMAKDA },
  { section: ".mp", ...THUMAKDA },
  { section: ".rs", ...THUMAKDA },
  { section: ".ft", ...THUMAKDA },
];
