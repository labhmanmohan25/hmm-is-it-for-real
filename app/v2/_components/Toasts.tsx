"use client";

import { useEffect, useState } from "react";
import { onToast, type ToastMsg } from "../_lib/toast";

// Small paper pop-ups for the RSVP Easter eggs. Top of the screen, never modal, never in the way
// of the form: the stack itself ignores pointer events, only the × button takes taps.
export default function Toasts() {
  const [items, setItems] = useState<(ToastMsg & { out?: boolean })[]>([]);

  useEffect(
    () =>
      onToast((t) => {
        setItems((cur) => (cur.some((c) => c.text === t.text && !c.out) ? cur : [...cur.slice(-2), t]));
        setTimeout(() => dismiss(t.id), 4200);
      }),
    [],
  );

  function dismiss(id: number) {
    setItems((cur) => cur.map((c) => (c.id === id ? { ...c, out: true } : c)));
    setTimeout(() => setItems((cur) => cur.filter((c) => c.id !== id)), 300);
  }

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.out ? "toast-out" : ""}`}>
          <span>{t.text}</span>
          <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
