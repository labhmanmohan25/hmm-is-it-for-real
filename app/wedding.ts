// All the wedding details live here. Edit names, dates, venues and contacts in this one file.

export const wedding = {
  bride: {
    name: "Apurva",
    native: "অপূর্বা",
    roots: "Kolkata, Bengal",
  },
  groom: {
    name: "Manmohan",
    native: "मनमोहन",
    roots: "Mithila, Bihar",
  },
  // Drop photos into /public/photos and set the paths to swap the placeholder faces
  // in the intro (square face crops work best, ~800px).
  photos: {
    bride: null as string | null,
    groom: null as string | null,
  },
  families: {
    bride: {
      name: "The Biswas Family",
      greeting: "সুস্বাগতম",
      line: "Can't wait to dance with you",
    },
    groom: {
      name: "The Labh Family",
      greeting: "अहाँ सभक स्वागत अछि",
      line: "Pack your dancing shoes",
    },
  },
  // ISO date-time of the main ceremony (used by the countdown + calendar file)
  date: "2027-01-18T18:00:00+05:30",
  dateLabel: "18 · 01 · 2027",
  hashtag: "#ApurvaWedsManmohan",
  venue: {
    name: "CIDCO Auditorium & Convention Centre",
    floor: "1st floor, opposite Joyalukkas Vashi",
    address: "Swami Pranabananda Marg, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
    mapUrl: "https://share.google/U18YJqoVdXvkJQ2LC",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1050.0613426232735!2d72.99461453895292!3d19.06697218472708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c12d61d6b4ad%3A0x55ccb163b8824685!2sCIDCO%20Auditorium%20And%20Convention%20Centre!5e1!3m2!1sen!2sin!4v1793226255573!5m2!1sen!2sin",
    lat: 19.06697,
    lng: 72.99461,
    station: "Vashi",
    // "How far is it?" milestones — approximate road distance + typical travel time to the venue.
    // `km` can be a string (the long-drive stone shows a wink instead of a number) and `unit: ""` hides "km".
    reach: [
      { code: "NMI", native: "नवी मुंबई विमानतळ", name: "Navi Mumbai Airport", km: 20, how: "~35 min by cab", top: "haldi" },
      { code: "BOM", native: "मुंबई विमानतळ", name: "Mumbai Airport T1 / T2", km: 22, how: "45–75 min by cab", top: "marigold" },
      { code: "LTT", native: "लो. टिळक टर्मिनस", name: "Kurla LTT · Bihar & Bengal trains", km: 14, how: "~40 min by cab", top: "tota" },
      { code: "CSMT", native: "छ. शिवाजी महाराज टर्मिनस", name: "CSMT · Harbour line to Vashi", km: 30, how: "~55 min by local · ~1 hr by cab", top: "peacock" },
      { code: "VSH", native: "वाशी स्टेशन", name: "Vashi station · Harbour line", km: 1, how: "5 min by auto", top: "rani" },
      { code: "CAR", native: "लंबी ड्राइव", name: "By car · the long drive", km: ";)", unit: "", how: "Road trip, playlist, chai stops. Worth every km.", top: "sindoor" },
    ] as { code: string; native: string; name: string; km: number | string; unit?: string; how: string; top: string }[],
  },
  // The three places that matter, with timings. Shown as cards in the Venue section.
  // `photo`: drop a real photo of the place into /public/photos and put its path here (e.g. "/photos/stay.jpg")
  // and it shows above the map. `mapUrl`: paste the place's own Google Maps share link for exact directions.
  places: [
    {
      key: "stay",
      label: "Stay",
      name: "Atithi Stays",
      area: "Panvel",
      when: "Check-in 17 Jan · Check-out 19 Jan",
      address: "Panvel, Navi Mumbai",
      note: "The full bungalow is booked for you. Just bring yourself (and your dancing shoes).",
      q: "Aatithi Stay, Panvel",
      mapUrl: "https://share.google/w1J12HBqjlG1oHEx0",
      // calendar entry: all-day from check-in to check-out (end is inclusive)
      cal: { title: "Check-in at Atithi Stays, Panvel", allDay: true, start: "2027-01-17", end: "2027-01-19" },
      photo: null as string | null,
      color: "peacock",
      tip: null as string | null,
    },
    {
      key: "haldi",
      label: "Haldi & Mehendi",
      name: "Sai Raj Farmhouse",
      area: "Panvel",
      when: "17 Jan · 11 AM – 5 PM",
      address: "Panvel, Navi Mumbai",
      note: "Haldi before lunch, mehendi after. Wear yellow, leave yellower.",
      q: "Sairaj Farm - Panvel",
      mapUrl: "https://share.google/Pf0VmP7yOD93F7Waj",
      cal: { title: "Haldi & Mehendi · Sai Raj Farmhouse", allDay: false, start: "2027-01-17T11:00:00+05:30", end: "2027-01-17T17:00:00+05:30" },
      photo: null as string | null,
      color: "haldi",
      tip: null as string | null,
    },
    {
      key: "shaadi",
      label: "Shaadi",
      name: "CIDCO Auditorium & Convention Centre",
      area: "Vashi",
      when: "18 Jan · 6 PM onwards",
      address: "1st floor, opposite Joyalukkas Vashi, Swami Pranabananda Marg, Sector 30A, Vashi, Navi Mumbai 400703",
      note: "Come early: the baraat leaves at 6 PM sharp and you're dancing in it.",
      tip: "Navi Mumbai has more CIDCOs than vada pav stalls. Type the full name, “CIDCO Auditorium And Convention Centre”, or you'll end up at somebody's property-tax hearing. Spot Joyalukkas Vashi: we're right opposite, 1st floor.",
      q: "CIDCO Auditorium And Convention Centre, Vashi",
      mapUrl: "https://share.google/U18YJqoVdXvkJQ2LC",
      cal: { title: "Apurva weds Manmohan · Baraat, Jaimala & Vivah", allDay: false, start: "2027-01-18T18:00:00+05:30", end: "2027-01-19T05:00:00+05:30" },
      photo: null as string | null,
      color: "sindoor",
    },
  ],
  // WhatsApp number (with country code, digits only) that receives RSVPs
  rsvpWhatsApp: "919999999999",
  // RSVP asks veg / non-veg separately for each day
  meals: [
    { key: "day1", label: "17 Jan · Haldi & Mehendi" },
    { key: "day2", label: "18 Jan · Shaadi" },
  ],
  events: [
    {
      name: "Haldi",
      native: "हल्दी",
      tag: "Day 1",
      date: "17 Jan",
      time: "11:00 AM, before lunch",
      place: "Sai Raj Farmhouse, Panvel",
      blurb: "Turmeric, conch shells and absolutely no clean clothes. Wear yellow, leave yellower.",
      art: "ev-haldi-ceremony",
      color: "yellow",
    },
    {
      name: "Mehendi",
      native: "मेहँदी",
      tag: "Day 1",
      date: "17 Jan",
      time: "After lunch, till 5:00 PM",
      place: "Sai Raj Farmhouse, Panvel",
      blurb: "Henna up to the elbows and a hunt for the groom's name hidden somewhere in the bride's palm.",
      art: "ev-mehndi-ceremony",
      color: "green",
    },
    {
      name: "Baraat",
      native: "बरियाती",
      tag: "Day 2",
      date: "18 Jan",
      time: "6:00 PM sharp · come early!",
      place: "CIDCO Auditorium, Vashi",
      blurb: "The groom arrives in a pink paag with a band, the uncles, the friends and an entire army of dancing folks. Be there before it leaves.",
      art: "ev-baraat",
      color: "orange",
    },
    {
      name: "Jaimala & Reception",
      native: "जयमाला",
      tag: "Day 2",
      date: "18 Jan",
      time: "8:00 PM",
      place: "CIDCO Auditorium, Vashi",
      blurb: "Garlands on stage, the bride in her lehenga, then come up for photos and blessings.",
      art: "ev-jaimala",
      color: "red",
    },
    {
      name: "Vivah · Sindoor Daan",
      native: "विवाह",
      tag: "Day 2",
      date: "Night of 18 Jan",
      time: "3:00 AM",
      place: "CIDCO Auditorium, Vashi",
      blurb: "Seven pheras and one sindoor under the late-night stars. Two families tied into a single knot.",
      art: "ev-vivah",
      color: "maroon",
    },
  ],
} as const;

export type WeddingEvent = (typeof wedding.events)[number];
