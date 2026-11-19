"use client";

// Fire-and-forget pop-ups (RSVP Easter eggs). Rendered by <Toasts/>; never modal, never blocking.
export type ToastMsg = { id: number; text: string };
type Listener = (t: ToastMsg) => void;

const listeners = new Set<Listener>();
let id = 0;

export function toast(text: string) {
  const t = { id: ++id, text };
  listeners.forEach((l) => l(t));
}

export function onToast(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
