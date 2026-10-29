// Mumbai trip planner for guests. Draft list — swap in your own favourites.
// Coordinates are approximate pin positions for the map; "Open in Google Maps" searches by name + area,
// so keep `q` specific enough for Google to find the right place.

export type Stop = {
  name: string;
  q: string; // Google Maps search text
  kind: "see" | "eat";
  lat: number;
  lng: number;
  tip: string;
};

export type Day = {
  title: string;
  native: string;
  color: string;
  stops: Stop[];
};

export const days: Day[] = [
  {
    title: "South Bombay classics",
    native: "पहिल दिन",
    color: "#d90429",
    stops: [
      { name: "Leopold Cafe", q: "Leopold Cafe Colaba", kind: "eat", lat: 18.9226, lng: 72.8318, tip: "Breakfast where half of Bombay's stories start." },
      { name: "Gateway of India", q: "Gateway of India", kind: "see", lat: 18.922, lng: 72.8347, tip: "Go early, before the selfie crowd." },
      { name: "Taj Mahal Palace", q: "The Taj Mahal Palace Mumbai", kind: "see", lat: 18.9217, lng: 72.8331, tip: "Walk the lobby, admire the dome." },
      { name: "Colaba Causeway", q: "Colaba Causeway", kind: "see", lat: 18.9161, lng: 72.8259, tip: "Street shopping. Bargain like a Bihari." },
      { name: "Kala Ghoda", q: "Kala Ghoda Mumbai", kind: "see", lat: 18.9285, lng: 72.8322, tip: "Galleries, cafés, heritage lanes." },
      { name: "Britannia & Co.", q: "Britannia & Co Ballard Estate", kind: "eat", lat: 18.9345, lng: 72.8397, tip: "Berry pulao. Lunch only, closed Sundays." },
      { name: "CSMT", q: "Chhatrapati Shivaji Maharaj Terminus", kind: "see", lat: 18.9398, lng: 72.8355, tip: "Gothic UNESCO station — lit up at night." },
      { name: "Marine Drive", q: "Marine Drive Mumbai", kind: "see", lat: 18.9432, lng: 72.8236, tip: "Sunset on the Queen's Necklace." },
      { name: "Bademiya", q: "Bademiya Colaba", kind: "eat", lat: 18.9231, lng: 72.8325, tip: "Late-night seekh kebabs off the street." },
    ],
  },
  {
    title: "Faith, sea & Bandra",
    native: "দ্বিতীয় দিন",
    color: "#0a7ea4",
    stops: [
      { name: "Siddhivinayak Temple", q: "Siddhivinayak Temple Prabhadevi", kind: "see", lat: 19.0169, lng: 72.8302, tip: "Bappa's blessing for the newlyweds." },
      { name: "Haji Ali Dargah", q: "Haji Ali Dargah", kind: "see", lat: 18.9827, lng: 72.8089, tip: "Walk out at low tide." },
      { name: "Swati Snacks", q: "Swati Snacks Tardeo", kind: "eat", lat: 18.9719, lng: 72.8129, tip: "Panki and sev puri. Expect a queue." },
      { name: "Bandra–Worli Sea Link", q: "Bandra Worli Sea Link", kind: "see", lat: 19.03, lng: 72.816, tip: "Take a cab across, windows down." },
      { name: "Bandstand & Mannat", q: "Bandstand Promenade Bandra", kind: "see", lat: 19.0459, lng: 72.8196, tip: "Wave at SRK's gate. He won't wave back." },
      { name: "Elco Pani Puri", q: "Elco Pani Puri Centre Hill Road Bandra", kind: "eat", lat: 19.0553, lng: 72.8338, tip: "Pani puri, ragda pattice." },
      { name: "Carter Road", q: "Carter Road Promenade", kind: "see", lat: 19.0666, lng: 72.8215, tip: "Sea-facing promenade + cafés." },
      { name: "Juhu Beach", q: "Juhu Beach", kind: "see", lat: 19.0988, lng: 72.8265, tip: "Pav bhaji and gola at sunset." },
    ],
  },
  {
    title: "Old Bombay bazaars & food",
    native: "तेसर दिन",
    color: "#2b9348",
    stops: [
      { name: "Kyani & Co.", q: "Kyani and Co Marine Lines", kind: "eat", lat: 18.9448, lng: 72.8271, tip: "Irani café: bun maska + chai." },
      { name: "Banganga Tank", q: "Banganga Tank Walkeshwar", kind: "see", lat: 18.9456, lng: 72.7935, tip: "Quiet ancient tank in the middle of the city." },
      { name: "Hanging Gardens", q: "Hanging Gardens Malabar Hill", kind: "see", lat: 18.9568, lng: 72.805, tip: "Views over Marine Drive." },
      { name: "Girgaon Chowpatty", q: "Girgaon Chowpatty", kind: "see", lat: 18.9548, lng: 72.814, tip: "Bhel puri on the sand." },
      { name: "Shree Thaker Bhojanalay", q: "Shree Thaker Bhojanalay Kalbadevi", kind: "eat", lat: 18.952, lng: 72.8285, tip: "Unlimited Gujarati thali." },
      { name: "Crawford Market", q: "Crawford Market Mumbai", kind: "see", lat: 18.9474, lng: 72.8343, tip: "Dry fruits, spices, everything." },
      { name: "Mahalaxmi Dhobi Ghat", q: "Mahalaxmi Dhobi Ghat", kind: "see", lat: 18.9823, lng: 72.8251, tip: "World's biggest open-air laundry." },
      { name: "Mohammed Ali Road", q: "Mohammed Ali Road", kind: "eat", lat: 18.956, lng: 72.8333, tip: "Night food street: malpua, nalli nihari." },
    ],
  },
  {
    title: "Navi Mumbai, near the venue",
    native: "চতুর্থ দিন",
    color: "#ff2e88",
    stops: [
      { name: "Flamingo wetlands, Nerul", q: "NRI Complex flamingo point Nerul", kind: "see", lat: 19.0085, lng: 73.0205, tip: "February is peak flamingo season. Go at high tide." },
      { name: "Wonders Park", q: "Wonders Park Nerul", kind: "see", lat: 19.037, lng: 73.019, tip: "Seven wonders replicas — very filmy." },
      { name: "Mini Seashore, Vashi", q: "Mini Seashore Vashi", kind: "see", lat: 19.0745, lng: 72.9945, tip: "Evening walk by the creek." },
      { name: "Inorbit Mall, Vashi", q: "Inorbit Mall Vashi", kind: "see", lat: 19.0661, lng: 73.001, tip: "Last-minute shagun envelopes and outfits." },
    ],
  },
];
