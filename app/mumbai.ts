// Mumbai trip planner for guests, built from Apurva & Manmohan's own list (plus Banganga as a bonus).
// Coordinates are approximate pin positions for the map; "Open in Google Maps" searches by name + area,
// so keep `q` specific enough for Google to find the right place.

export type Stop = {
  name: string;
  q: string; // Google Maps search text
  kind: "see" | "eat" | "us";
  // Leave lat/lng out when unsure of the exact spot: it still lists (and links to Google Maps), just no pin.
  lat?: number;
  lng?: number;
  tip: string;
};

export type Day = {
  title: string;
  native: string;
  color: string;
  // A collection of places rather than a day's route: no connecting line, no "route" button
  noRoute?: boolean;
  stops: Stop[];
};

export const days: Day[] = [
  {
    title: "Colaba, caves & galleries",
    native: "पहिल दिन",
    color: "#d90429",
    stops: [
      { name: "Gateway of India", q: "Gateway of India", kind: "see", lat: 18.922, lng: 72.8347, tip: "Go early, before the selfie crowd. Ferries to Elephanta leave from here." },
      { name: "Elephanta Caves", q: "Elephanta Caves", kind: "see", lat: 18.9633, lng: 72.9315, tip: "An hour by ferry, then rock-cut Shiva caves. Closed Mondays." },
      { name: "Cafe Mondegar", q: "Cafe Mondegar Colaba", kind: "eat", lat: 18.9239, lng: 72.8317, tip: "Beer, jukebox and Mario Miranda cartoons on every wall." },
      { name: "Ling's Pavilion", q: "Ling's Pavilion Colaba", kind: "eat", lat: 18.9226, lng: 72.8309, tip: "Old-school Chinese the city swears by." },
      { name: "Delhi Darbar", q: "Delhi Darbar Colaba", kind: "eat", tip: "Mutton biryani. No further questions." },
      { name: "Miya Kebabs", q: "Miya Kebabs Mumbai", kind: "eat", tip: "Late-night kebabs. Chicken Changezi is the move." },
      { name: "Jehangir Art Gallery & Kala Ghoda", q: "Jehangir Art Gallery Kala Ghoda", kind: "see", lat: 18.9272, lng: 72.8317, tip: "Free art, heritage lanes, street murals." },
      { name: "CST Museum (CSMVS)", q: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", kind: "see", lat: 18.9269, lng: 72.8326, tip: "Bombay's grand old museum. The garden alone is worth it." },
      { name: "Boojee Cafe, Kala Ghoda", q: "Boojee Cafe Kala Ghoda Fort", kind: "eat", tip: "Coffee and brunch break between galleries." },
      { name: "Trishna", q: "Trishna Kala Ghoda", kind: "eat", lat: 18.9298, lng: 72.8327, tip: "Butter garlic crab. Wear the bib, no shame." },
    ],
  },
  {
    title: "Fort, CST & Marine Drive",
    native: "দ্বিতীয় দিন",
    color: "#0a7ea4",
    stops: [
      { name: "Pancham Puriwala", q: "Pancham Puriwala CSMT", kind: "eat", lat: 18.9403, lng: 72.8358, tip: "Puri bhaji breakfast since 1850-something." },
      { name: "Aaram Vada Pav", q: "Aaram Vada Pav CSMT", kind: "eat", lat: 18.9405, lng: 72.8347, tip: "Our vada pav #2. Opposite CSMT." },
      { name: "CST station", q: "Chhatrapati Shivaji Maharaj Terminus", kind: "see", lat: 18.9398, lng: 72.8355, tip: "Gothic UNESCO station. Come back at night when it's lit up." },
      { name: "Asiatic Library", q: "Asiatic Society of Mumbai Town Hall", kind: "see", lat: 18.9317, lng: 72.8361, tip: "Sit on the famous steps. Everyone does." },
      { name: "Horniman Circle", q: "Horniman Circle Garden", kind: "see", lat: 18.9327, lng: 72.835, tip: "Colonial ring of buildings around a quiet garden." },
      { name: "Cafe Nur", q: "Cafe Nur Horniman Circle Fort", kind: "eat", lat: 18.933, lng: 72.8355, tip: "Kebabs and biryani in ghee. Book ahead." },
      { name: "Pratap Lunch Home", q: "Pratap Lunch Home Fort", kind: "eat", tip: "Coastal seafood. Bombil fry, prawn gassi." },
      { name: "Mahesh Lunch Home", q: "Mahesh Lunch Home Fort", kind: "eat", tip: "Mangalorean seafood legend." },
      { name: "Samrat", q: "Samrat Restaurant Churchgate", kind: "eat", lat: 18.9333, lng: 72.8262, tip: "Gujarati thali that won't stop coming." },
      { name: "Kyani & Co.", q: "Kyani and Co Marine Lines", kind: "eat", lat: 18.9448, lng: 72.8271, tip: "Irani café: bun maska + chai." },
      { name: "Marine Drive", q: "Marine Drive Mumbai", kind: "see", lat: 18.9432, lng: 72.8236, tip: "Sunset on the Queen's Necklace. Sit on the wall." },
      { name: "Girgaon Chowpatty viewing platform", q: "Girgaon Chowpatty viewing deck", kind: "see", lat: 18.9548, lng: 72.814, tip: "The new platform over the sea. Best night view of Marine Drive." },
      { name: "Bachelor's", q: "Bachelorr's Chowpatty", kind: "eat", lat: 18.9555, lng: 72.8124, tip: "Fruit cream and chilli ice cream. Yes, chilli." },
    ],
  },
  {
    title: "Temples, sea face & Bandra",
    native: "तेसर दिन",
    color: "#2b9348",
    stops: [
      { name: "Kamla Nehru Park", q: "Kamala Nehru Park Malabar Hill", kind: "see", lat: 18.9566, lng: 72.8049, tip: "Malabar Hill viewpoint over the whole bay. Climb into the giant shoe." },
      { name: "Banganga Tank", q: "Banganga Tank Walkeshwar", kind: "see", lat: 18.9456, lng: 72.7935, tip: "Bonus: an ancient tank hidden in the city. Reddit's favourite secret." },
      { name: "Babulnath Temple", q: "Babulnath Temple", kind: "see", lat: 18.9586, lng: 72.81, tip: "Old Shiva temple on the hill." },
      { name: "Swati Snacks", q: "Swati Snacks Tardeo", kind: "eat", lat: 18.9719, lng: 72.8129, tip: "Panki and sev puri. Expect a queue." },
      { name: "Mahalakshmi Temple", q: "Mahalakshmi Temple Mumbai", kind: "see", lat: 18.9772, lng: 72.8063, tip: "Right on the sea. Grab flowers at the gate." },
      { name: "Haji Ali Dargah", q: "Haji Ali Dargah", kind: "see", lat: 18.9827, lng: 72.8089, tip: "Walk out along the causeway at low tide." },
      { name: "Haji Ali Juice Center", q: "Haji Ali Juice Centre", kind: "eat", lat: 18.9822, lng: 72.8116, tip: "Sitaphal cream. Fight us." },
      { name: "Nehru Planetarium", q: "Nehru Planetarium Worli", kind: "see", lat: 18.9895, lng: 72.8165, tip: "Sky show under the dome." },
      { name: "The Bombay Canteen", q: "The Bombay Canteen Lower Parel", kind: "eat", lat: 19.0016, lng: 72.8278, tip: "Fancy desi plates and cocktails." },
      { name: "PF Chang's", q: "PF Chang's Mumbai", kind: "eat", tip: "Dynamite shrimp, lettuce wraps." },
      { name: "Worli Promenade", q: "Worli Sea Face Promenade", kind: "see", lat: 19.008, lng: 72.815, tip: "Sea face walk with Sea Link views." },
      { name: "Dadar Chowpatty", q: "Dadar Chowpatty", kind: "see", lat: 19.0234, lng: 72.8357, tip: "Local beach, local vibe." },
      { name: "Aaswad, Dadar", q: "Aaswad Dadar", kind: "eat", lat: 19.0195, lng: 72.8429, tip: "Misal pav. Best Maharashtrian breakfast in town." },
      { name: "Guru Kripa, Sion", q: "Guru Kripa Sion", kind: "eat", lat: 19.042, lng: 72.862, tip: "Samosa chole. Locals queue for a reason." },
      { name: "Bandra–Worli Sea Link", q: "Bandra Worli Sea Link", kind: "see", lat: 19.03, lng: 72.816, tip: "Take a cab across, windows down." },
      { name: "Baba Falooda", q: "Baba Falooda Mahim", kind: "eat", lat: 19.041, lng: 72.8405, tip: "Royal falooda at Mahim. Dessert first." },
      { name: "Bandra Reclamation", q: "Bandra Reclamation Promenade", kind: "see", lat: 19.0417, lng: 72.8189, tip: "Watch the Sea Link light up at sunset." },
      { name: "Bandra Fort", q: "Castella de Aguada Bandra Fort", kind: "see", lat: 19.0418, lng: 72.8186, tip: "Portuguese ruins on the rocks." },
      { name: "Bandra Bandstand", q: "Bandstand Promenade Bandra", kind: "see", lat: 19.0459, lng: 72.8196, tip: "Sea breeze, rocks and SRK's gate." },
      { name: "Mount Mary", q: "Mount Mary Basilica Bandra", kind: "see", lat: 19.0466, lng: 72.8225, tip: "Hilltop basilica with sea views." },
      { name: "Candies", q: "Candies Pali Hill Bandra", kind: "eat", tip: "Bandra's go-to café. Grab a sandwich and wander." },
      { name: "Veronica's", q: "Veronica's Bandra", kind: "eat", tip: "Sandwiches, burgers and beer in a Bandra bungalow." },
      { name: "Basque by Breve", q: "Basque by Breve Bandra", kind: "eat", lat: 19.0646, lng: 72.8296, tip: "Burnt Basque cheesecake. Get your own slice." },
      { name: "Carter Road", q: "Carter Road Promenade", kind: "see", lat: 19.0666, lng: 72.8215, tip: "Sea-facing promenade and cafés." },
    ],
  },
  {
    title: "Caves, forest & Juhu",
    native: "চতুর্থ দিন",
    color: "#ff2e88",
    stops: [
      { name: "Sanjay Gandhi National Park", q: "Sanjay Gandhi National Park Borivali", kind: "see", lat: 19.2288, lng: 72.9182, tip: "A forest inside the city. Go early." },
      { name: "Kanheri Caves", q: "Kanheri Caves", kind: "see", lat: 19.2058, lng: 72.9064, tip: "100+ Buddhist caves inside the park. Wear shoes." },
      { name: "Joey's Pizza, Malad", q: "Joey's Pizza Malad West", kind: "eat", tip: "Malad's best pizza. Half-and-half, Meat Ultimo." },
      { name: "Amar Juice Centre", q: "Amar Juice Centre Vile Parle", kind: "eat", tip: "Juice and grilled sandwiches, Parle style." },
      { name: "Achija", q: "Achija Vile Parle", kind: "eat", tip: "Gujarati snacks. Order more than you think." },
      { name: "Juhu & Silver Beach", q: "Juhu Beach", kind: "see", lat: 19.0988, lng: 72.8265, tip: "Pav bhaji and gola at sunset." },
      { name: "Prithvi Cafe", q: "Prithvi Cafe Juhu", kind: "eat", lat: 19.1065, lng: 72.8258, tip: "Irish coffee under the trees, theatre crowd all around." },
    ],
  },
];

// Apurva & Manmohan's own Mumbai: schools, vada pav rankings, hangouts. Shown as its own tab in the planner.
export const ours: Day = {
  title: "Apurva & Manmohan's Mumbai",
  native: "हमर मुंबई",
  color: "#ff2e88",
  noRoute: true,
  stops: [
    { name: "Khandeshwar station", q: "Khandeshwar railway station", kind: "us", lat: 19.0072, lng: 73.0395, tip: "Where Manmohan asked Apurva out. She thought she'd only come to collect Photoshop." },
    { name: "KV Panvel", q: "Kendriya Vidyalaya Panvel", kind: "us", tip: "Apurva's school." },
    { name: "Apeejay School, Nerul", q: "Apeejay School Nerul", kind: "us", lat: 19.0382, lng: 73.0133, tip: "Manmohan's school." },
    { name: "Nityanand Vada Pav", q: "Nityanand Vada Pav", kind: "eat", tip: "Best vada pav we've ever had. #1, not up for debate." },
    { name: "Aaram Vada Pav", q: "Aaram Vada Pav CSMT", kind: "eat", lat: 18.9405, lng: 72.8347, tip: "Vada pav #2. Opposite CSMT." },
    { name: "Jimi's Burger, Vashi", q: "Jimis Burger Vashi", kind: "eat", lat: 19.0743, lng: 73.0014, tip: "Our burger place. Go hungry." },
    { name: "Basque by Breve", q: "Basque by Breve Bandra", kind: "eat", lat: 19.0646, lng: 72.8296, tip: "Burnt Basque cheesecake. Get your own slice." },
    { name: "Focaccia Raja", q: "Focaccia Raja Mumbai", kind: "eat", tip: "Focaccia, the royal way." },
    { name: "Persian Darbar", q: "Persian Darbar Byculla", kind: "eat", lat: 18.9756, lng: 72.8327, tip: "Biryani and kebabs, darbar-sized portions." },
    { name: "Noor Mohammadi", q: "Noor Mohammadi Hotel Bhendi Bazaar", kind: "eat", lat: 18.9575, lng: 72.8318, tip: "Old-school Bhendi Bazaar kitchen." },
    { name: "Bademiya, Colaba", q: "Bademiya Colaba", kind: "eat", lat: 18.9231, lng: 72.8325, tip: "Late-night seekh kebabs off the street." },
    { name: "Bandra Bandstand", q: "Bandstand Promenade Bandra", kind: "see", lat: 19.0459, lng: 72.8196, tip: "Sea breeze, rocks, and SRK's gate." },
    { name: "Sea Link Promenade", q: "Bandra Reclamation Promenade Sea Link", kind: "see", lat: 19.0417, lng: 72.8189, tip: "Watch the Sea Link light up at sunset." },
    { name: "Colaba Causeway", q: "Colaba Causeway", kind: "see", lat: 18.9161, lng: 72.8259, tip: "Street shopping. Bargain hard." },
    { name: "Kala Ghoda", q: "Kala Ghoda Mumbai", kind: "see", lat: 18.9285, lng: 72.8322, tip: "Galleries, cafés, heritage lanes." },
    { name: "Gateway of India", q: "Gateway of India", kind: "see", lat: 18.922, lng: 72.8347, tip: "Classic. Go early, before the selfie crowd." },
    { name: "Marine Drive", q: "Marine Drive Mumbai", kind: "see", lat: 18.9432, lng: 72.8236, tip: "Sunset on the Queen's Necklace." },
    { name: "Phoenix Palladium", q: "Palladium Mall Lower Parel", kind: "see", lat: 18.9946, lng: 72.8258, tip: "When it's too hot for Marine Drive." },
  ],
};
