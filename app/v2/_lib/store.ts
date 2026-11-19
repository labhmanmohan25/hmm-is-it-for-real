"use client";

import { useSyncExternalStore } from "react";

// Tiny shared store so the RSVP form can hand its trip dates to the itinerary planner.
// Persisted per visitor in localStorage (best effort: private windows may block it).

export type Trip = { arrive: string; leave: string } | null;

const KEY = "awm-v2-trip";
let trip: Trip = null;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) trip = JSON.parse(raw);
  } catch {
    /* storage unavailable */
  }
}

export function setTrip(next: Trip) {
  trip = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  subs.forEach((f) => f());
}

export function useTrip(): Trip {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => {
      load();
      return trip;
    },
    () => null,
  );
}
