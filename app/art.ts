// Artwork shipped in /public/art. Sources and licences are listed in ./credits.json
// (shown in the site footer). Width/height are the real pixel sizes of the WebP files.

const sizes = {
  "alpona-band": [1800, 1800],
  "alpona-peacock": [1600, 1600],
  "alpona-round": [1400, 1387],
  "alpona-star": [1400, 1400],
  "golghar-watercolor": [1513, 947],
  "howrah-night-white": [1600, 778],
  "howrah-night": [1280, 508],
  kalash: [500, 710],
  "kalighat-cat-fish": [1280, 2086],
  "kalighat-lady-fish": [1280, 1793],
  "kalighat-radha-krishna": [1280, 1783],
  "madhubani-doli": [1620, 1355],
  "madhubani-peacock": [900, 1947],
  "madhubani-roundel": [690, 690],
  "madhubani-tree": [1280, 1988],
  "mango-toran": [1600, 512],
  "marigold-garlands": [1600, 2407],
  "marigold-painting": [1280, 1688],
  "pata-chariot": [1600, 1200],
  "pata-horse-rider": [1600, 1200],
  "pata-lotus": [1280, 960],
  "pata-women": [1600, 1200],
  "truck-blowhorn": [960, 720],
  "truck-horn-hindi": [1600, 1067],
  "truck-horn": [1600, 1600],
  "nimbu-mirchi": [500, 1231],
  "kaali-peeli": [1200, 930],
  "mithila-paag": [900, 576],
  "local-train": [1600, 1200],
  "sea-link": [1920, 1277],
  gateway: [1600, 1067],
  "bride-mukut": [832, 1062],
  "groom-mukut": [274, 170],
  "litti-chokha": [700, 496],
  rosogolla: [700, 550],
  makhana: [600, 600],
  "taxi-side": [1267, 503],
  "chhota-pandit-bb": [387, 516],
  "news-aunty": [315, 420],
  "news-uncle": [169, 420],
  "news-didi": [209, 420],
  "news-chachi": [139, 420],
  "news-dadi": [392, 420],
} as const;

export type ArtName = keyof typeof sizes;

export function art(name: ArtName) {
  const [width, height] = sizes[name];
  return { src: `/art/${name}.webp`, width, height };
}
