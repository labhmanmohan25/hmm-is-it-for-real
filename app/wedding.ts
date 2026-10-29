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
      line: "With love from Bengal, by way of Mumbai",
    },
    groom: {
      name: "The Labh Family",
      greeting: "अहाँ सभक स्वागत अछि",
      line: "With love from Mithila, by way of Mumbai",
    },
  },
  // ISO date-time of the main ceremony (used by the countdown + calendar file)
  date: "2027-01-18T18:00:00+05:30",
  dateLabel: "18 · 01 · 2027",
  hashtag: "#ApurvaWedsManmohan",
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
    // "How far is it?" milestones — approximate road distance + typical travel time to the venue
    reach: [
      { code: "NMI", native: "नवी मुंबई विमानतळ", name: "Navi Mumbai Airport", km: 20, how: "~35 min by cab", top: "haldi" },
      { code: "BOM", native: "मुंबई विमानतळ", name: "Mumbai Airport T1 / T2", km: 22, how: "45–75 min by cab", top: "marigold" },
      { code: "LTT", native: "लो. टिळक टर्मिनस", name: "Kurla LTT · Bihar & Bengal trains", km: 14, how: "~40 min by cab", top: "tota" },
      { code: "VSH", native: "वाशी स्टेशन", name: "Vashi station · Harbour line", km: 1, how: "5 min by auto", top: "rani" },
    ],
  },
  // WhatsApp number (with country code, digits only) that receives RSVPs
  rsvpWhatsApp: "919999999999",
  events: [
    {
      name: "Haldi · Gaye Holud",
      native: "হলুদ",
      tag: "Both",
      date: "17 Jan",
      time: "3:00 PM",
      place: "Navi Mumbai",
      blurb: "Turmeric, conch shells and absolutely no clean clothes. Wear yellow, leave yellower.",
      art: "marigold-painting",
      color: "yellow",
    },
    {
      name: "Mehendi",
      native: "मेहँदी",
      tag: "Both",
      date: "17 Jan",
      time: "6:00 PM",
      place: "Navi Mumbai",
      blurb: "Henna up to the elbows and a hunt for the groom's name hidden somewhere in the bride's palm.",
      art: "madhubani-peacock",
      color: "green",
    },
    {
      name: "Sangeet",
      native: "संगीत",
      tag: "Party",
      date: "17 Jan",
      time: "8:00 PM",
      place: "Navi Mumbai",
      blurb: "Dholak, Maithili geet, Rabindra Sangeet remixes and Bollywood. Dance-off: Mithila vs Bengal.",
      art: "lottie:dhol-shehnai",
      color: "pink",
    },
    {
      name: "Barati Swagat",
      native: "बरियाती",
      tag: "Maithil",
      date: "18 Jan",
      time: "6:00 PM onwards",
      place: "CIDCO Auditorium, Vashi",
      blurb: "The groom arrives in a pink Mithila paag with a band and an entire state's worth of dancing uncles.",
      art: "pata-horse-rider",
      color: "orange",
    },
    {
      name: "Jaimala & Reception",
      native: "जयमाला",
      tag: "Both",
      date: "18 Jan",
      time: "8:00 PM",
      place: "CIDCO Auditorium, Vashi",
      blurb: "Garlands on stage, the bride in her lehenga, then come up for photos, blessings and gifts.",
      art: "pata-women",
      color: "red",
    },
    {
      name: "Vivah · Sindoor Daan",
      native: "विवाह",
      tag: "Both",
      date: "Night of 18 Jan",
      time: "3:00 AM",
      place: "CIDCO Auditorium, Vashi",
      blurb: "Seven pheras, saat paak, one sindoor under the late-night stars. Two traditions tied into a single knot.",
      art: "kalighat-radha-krishna",
      color: "maroon",
    },
  ],
} as const;

export type WeddingEvent = (typeof wedding.events)[number];
