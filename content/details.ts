// Every personal detail used by the v2 site lives in this one file: names, dates, places, schools,
// photos, contacts. Anything still marked TODO shows up on the page as a visible "TODO" placeholder,
// so nothing half-finished can slip through unnoticed. Search this file for "TODO" to find them all.

/** Marks a detail that still has to be filled in. Rendered on the page as a yellow "TODO" tag. */
export const TODO = (what: string) => `TODO: ${what}`;
export const isTodo = (s: string | null | undefined) => typeof s === "string" && s.startsWith("TODO");

export const details = {
  bride: { name: "Apurva", native: "অপূর্বা" },
  groom: { name: "Manmohan", native: "मनमोहन" },

  families: {
    // The "Two families" section is the one place Mithila and Bengal are named.
    groom: {
      name: "The Labh Family",
      region: "Mithila",
      greeting: "अहाँ सभक स्वागत अछि",
      greetingEn: "You are all most welcome (Maithili)",
      line: "With love from Mithila, by way of Mumbai",
    },
    bride: {
      name: "The Biswas Family",
      region: "Bengal",
      greeting: "সুস্বাগতম",
      greetingEn: "A warm welcome (Bengali)",
      line: "With love from Bengal, by way of Mumbai",
    },
  },

  // ISO date-time of the main ceremony (countdown + venue calendar file)
  date: "2027-01-18T18:00:00+05:30",
  dateLabel: "18 · 01 · 2027",
  hashtag: "#ApurvaWedsManmohan",
  // The two wedding days in the itinerary planner (no sightseeing on these)
  weddingDays: ["2027-01-17", "2027-01-18"],

  venue: {
    name: "CIDCO Auditorium & Convention Centre",
    floor: "1st floor, opposite Joyalukkas",
    address: "Swami Pranabananda Marg, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
    mapUrl: "https://maps.app.goo.gl/t8S4yh4EVhuvoQ5d6",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1050.0613426232735!2d72.99461453895292!3d19.06697218472708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c12d61d6b4ad%3A0x55ccb163b8824685!2sCIDCO%20Auditorium%20And%20Convention%20Centre!5e1!3m2!1sen!2sin!4v1793226255573!5m2!1sen!2sin",
    lat: 19.06697,
    lng: 72.99461,
    station: "Vashi",
    reach: [
      { code: "NMI", native: "नवी मुंबई विमानतळ", name: "Navi Mumbai Airport", km: 20, how: "~35 min by cab", top: "haldi" },
      { code: "BOM", native: "मुंबई विमानतळ", name: "Mumbai Airport T1 / T2", km: 22, how: "45–75 min by cab", top: "marigold" },
      { code: "LTT", native: "लो. टिळक टर्मिनस", name: "Kurla LTT · long-distance trains", km: 14, how: "~40 min by cab", top: "tota" },
      { code: "VSH", native: "वाशी स्टेशन", name: "Vashi station · Harbour line", km: 1, how: "5 min by auto", top: "rani" },
    ],
  },

  // WhatsApp number (country code + digits only) that receives RSVPs
  rsvpWhatsApp: "919999999999", // TODO: real number (still the v1 placeholder)

  events: [
    {
      name: "Haldi · Gaye Holud",
      native: "হলুদ",
      tag: "Both",
      when: "17 Jan · Morning, before lunch",
      place: TODO("haldi + mehendi venue"),
      // Calendar time is approximate until the exact slot is fixed
      start: "2027-01-17T10:00:00+05:30" as string | null,
      hours: 3,
      blurb: "Turmeric, conch shells and absolutely no clean clothes. Wear yellow, leave yellower.",
      art: "marigold-painting",
      color: "yellow",
      friendsOnly: false,
    },
    {
      name: "Mehendi",
      native: "मेहँदी",
      tag: "Both",
      when: "17 Jan · Afternoon, after lunch",
      place: TODO("haldi + mehendi venue"),
      start: "2027-01-17T14:30:00+05:30" as string | null,
      hours: 3,
      blurb: "Henna up to the elbows and a hunt for the groom's name hidden somewhere in the bride's palm.",
      art: "madhubani-peacock",
      color: "green",
      friendsOnly: false,
    },
    {
      name: "Sangeet",
      native: "संगीत",
      tag: "Friends only",
      when: "17 Jan · Evening",
      place: "Sai Raj Farmhouse, Panvel",
      start: "2027-01-17T19:30:00+05:30" as string | null,
      hours: 4,
      blurb: "Just the gang, no family. Less sangeet, more party: Bollywood, Bhojpuri bangers and a dance floor till late.",
      art: "lottie:dhol-shehnai",
      color: "pink",
      friendsOnly: true,
    },
    {
      name: "Barati Swagat",
      native: "बरियाती",
      tag: "Baraat",
      when: "18 Jan · 6:00 PM onwards",
      place: "CIDCO Auditorium, Vashi",
      start: "2027-01-18T18:00:00+05:30" as string | null,
      hours: 2,
      blurb: "The groom arrives in a pink paag with a band and an entire colony's worth of dancing uncles.",
      art: "pata-horse-rider",
      color: "orange",
      friendsOnly: false,
    },
    {
      name: "Jaimala & Reception",
      native: "जयमाला",
      tag: "Both",
      when: "18 Jan · 8:00 PM",
      place: "CIDCO Auditorium, Vashi",
      start: "2027-01-18T20:00:00+05:30" as string | null,
      hours: 3,
      blurb: "Garlands on stage, the bride in her lehenga, then come up for photos, blessings and gifts.",
      art: "pata-women",
      color: "red",
      friendsOnly: false,
    },
    {
      name: "Vivah · Sindoor Daan",
      native: "विवाह",
      tag: "Both",
      when: "Late night, 18 to 19 Jan",
      place: "CIDCO Auditorium, Vashi",
      // Calendar entry: 19 Jan 2027, 3:00 AM
      start: "2027-01-19T03:00:00+05:30" as string | null,
      hours: 3,
      blurb: "Seven pheras, saat paak, one sindoor under the late-night stars. Two traditions tied into a single knot.",
      art: "kalighat-radha-krishna",
      color: "maroon",
      friendsOnly: false,
    },
  ],

  // What to wear: one card per event (same order as events)
  wear: [
    { event: "Haldi", swatches: ["#ffd60a", "#ffb703", "#fff8e7"], names: ["Yellow", "Marigold", "White"], note: "Wear yellow, leave yellower. Old clothes recommended." },
    { event: "Mehendi", swatches: ["#2b9348", "#9ee6c2", "#f6c6d8", "#cfe8ff"], names: ["Green", "Mint", "Pastels"], note: "Greens and soft pastels. Sleeves you can roll up." },
    { event: "Sangeet (friends)", swatches: ["#ff2e88", "#d4ff3a", "#c0c0c0", "#1b1214"], names: ["Party wear"], note: "Party wear, not wedding wear. Sparkle encouraged, shoes you can dance in." },
    { event: "Barati Swagat", swatches: ["#ff2e88", "#ff7b00", "#ffd60a", "#0a7ea4"], names: ["Bright festive"], note: "Bright and festive. The groom wears a pink Mithila paag." },
    { event: "Jaimala & Reception", swatches: ["#0f5257", "#6a0dad", "#8d0019", "#0b3d91"], names: ["Jewel tones"], note: "Festive ethnic in jewel tones: emerald, amethyst, ruby, sapphire." },
    { event: "Vivah", swatches: ["#d90429", "#fff8e7", "#ffd60a"], names: ["Red", "White", "Yellow"], note: "Traditional. Bengali red-and-white laal paar and Mithila red-yellow both welcome." },
  ],

  // ---------- "Our places" map preset ----------
  // Coordinates for TODO places are rough Navi Mumbai placeholders; fix them with the real pins.
  ourPlaces: [
    { name: TODO("Apurva's school"), q: TODO("Apurva's school"), lat: 19.033, lng: 73.0297, tip: "Where Apurva learned to win arguments." },
    { name: TODO("Manmohan's school"), q: TODO("Manmohan's school"), lat: 19.0473, lng: 73.0699, tip: "Where Manmohan learned to lose them." },
    { name: TODO("vada pav centre, name and area"), q: TODO("vada pav centre"), lat: 19.0771, lng: 73.0081, tip: "Best vada pav we have ever had. Fight us." },
    { name: `Jimmy's Burger, ${TODO("branch")}`, q: "Jimmy's Burger Navi Mumbai", lat: 19.0222, lng: 73.0296, tip: "Date night, every night." },
    { name: "Khandeshwar station, Navi Mumbai", q: "Khandeshwar railway station", lat: 19.0077, lng: 73.0953, tip: "Where he asked. Where she said yes." },
  ],
};

export type V2Event = (typeof details.events)[number];
