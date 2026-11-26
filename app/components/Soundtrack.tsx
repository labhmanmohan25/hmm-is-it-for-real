"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_TRACK, soundtrack, type Track } from "../music";

type Voice = { gain: GainNode; start: () => void; stop: () => void; prime?: () => void };
const FADE = 1.2; // seconds of crossfade between sections

// Scroll-driven soundtrack: each section has a track (app/music.ts) and the music crossfades as
// the section crosses the middle of the screen. Off until the guest taps the speaker (browsers
// only allow sound after a tap). Volume runs through Web Audio gain nodes because iPhones ignore
// <audio>.volume, so fades would otherwise be instant jumps.
export default function Soundtrack() {
  const [on, setOn] = useState(false);
  const [now, setNow] = useState<string | null>(null);
  const [hint, setHint] = useState(true);
  const ctx = useRef<AudioContext | null>(null);
  const voices = useRef(new Map<string, Voice>());
  const current = useRef(0); // index of the soundtrack entry for the section on screen
  const playing = useRef<string | null>(null);
  const live = useRef(false);
  const cued = useRef(new Set<string>());
  const finished = useRef(new Set<string>()); // `once` tracks that have played to the end
  const replay = useRef<(i: number) => void>(() => {});

  // Streamed <audio> for long tracks. Short loops (`seamless`) are decoded into memory and looped
  // by Web Audio itself, which is sample-accurate: <audio loop> leaves a small gap at the wrap.
  const voice = (src: string, seamless?: boolean, loopFrom = 0, once = false) => {
    let v = voices.current.get(src);
    const ac = ctx.current;
    if (v || !ac) return v;
    const gain = ac.createGain();
    gain.gain.value = 0;
    gain.connect(ac.destination);
    if (!seamless) {
      const el = new Audio(src);
      el.loop = !once;
      el.preload = "auto";
      if (once)
        el.addEventListener("ended", () => {
          finished.current.add(src);
          // still on this section: hand over to the default loop
          if (playing.current === src && live.current) replay.current(current.current);
        });
      ac.createMediaElementSource(el).connect(gain);
      v = {
        gain,
        start: () => void el.play().catch(() => {}),
        stop: () => el.pause(),
        // iPhones only let an <audio> element play if play() first ran inside a tap; a silent
        // play+pause during the unmute tap unlocks it for when its section scrolls in later
        prime: () =>
          void el
            .play()
            .then(() => playing.current !== src && el.pause())
            .catch(() => {}),
      };
    } else {
      let buffer: AudioBuffer | null = null;
      let node: AudioBufferSourceNode | null = null;
      let offset = 0;
      let startedAt = 0;
      let wanted = false;
      // plays from the very top once, then loops [loopFrom, end): the file's last seconds blend
      // back into its opening, so each repeat flows on instead of jumping
      const where = (t: number) => {
        const d = buffer!.duration;
        return t < d ? t : loopFrom + ((t - loopFrom) % (d - loopFrom));
      };
      const begin = () => {
        if (!buffer || node) return;
        node = ac.createBufferSource();
        node.buffer = buffer;
        node.loop = true;
        node.loopStart = loopFrom;
        node.loopEnd = buffer.duration;
        node.connect(gain);
        node.start(0, where(offset));
        startedAt = ac.currentTime;
      };
      fetch(src)
        .then((r) => r.arrayBuffer())
        .then((b) => ac.decodeAudioData(b))
        .then((b) => {
          buffer = b;
          if (wanted) begin();
        })
        .catch(() => {});
      v = {
        gain,
        start: () => {
          wanted = true;
          begin();
        },
        stop: () => {
          wanted = false;
          if (!node || !buffer) return;
          offset = where(where(offset) + ac.currentTime - startedAt);
          node.stop();
          node.disconnect();
          node = null;
        },
      };
    }
    voices.current.set(src, v);
    return v;
  };

  const ramp = (g: GainNode, to: number) => {
    const t = ctx.current!.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(to, t + FADE);
  };

  const play = useCallback((i: number) => {
    current.current = i;
    if (!live.current) return;
    const tr: Track = soundtrack[i].once && finished.current.has(soundtrack[i].src) ? { ...soundtrack[i], ...DEFAULT_TRACK, once: false } : soundtrack[i];
    setNow(tr.title);
    if (tr.cue && !cued.current.has(tr.section)) {
      cued.current.add(tr.section);
      new Audio(tr.cue).play().catch(() => {});
    }
    const prev = playing.current;
    if (prev && prev !== tr.src) {
      const old = voices.current.get(prev);
      if (old) {
        ramp(old.gain, 0);
        setTimeout(() => playing.current !== prev && old.stop(), FADE * 1000 + 100);
      }
    }
    const v = voice(tr.src, tr.seamless, tr.loopFrom, tr.once);
    if (!v) return;
    playing.current = tr.src;
    v.start();
    ramp(v.gain, tr.volume ?? 0.6);
  }, []);

  useEffect(() => {
    replay.current = play;
  }, [play]);

  // which section is crossing the middle of the screen
  useEffect(() => {
    const index = new Map<Element, number>();
    soundtrack.forEach((t, i) =>
      document.querySelectorAll(`:is(section, footer)${t.section}`).forEach((el) => index.set(el, i)),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) play(index.get(e.target)!);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    index.forEach((_, el) => io.observe(el));

    const onVis = () => {
      if (!ctx.current || !live.current) return;
      if (document.hidden) void ctx.current.suspend();
      else void ctx.current.resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [play]);

  const toggle = () => {
    setHint(false);
    if (!live.current) {
      ctx.current ??= new AudioContext();
      void ctx.current.resume();
      live.current = true;
      setOn(true);
      play(current.current);
      // unlock every streamed track now, while we're inside the tap (gain is 0, so it's silent)
      for (const t of soundtrack) if (!t.seamless && t.src !== playing.current) voice(t.src, false, 0, t.once)?.prime?.();
    } else {
      live.current = false;
      setOn(false);
      setNow(null);
      voices.current.forEach((v) => {
        ramp(v.gain, 0);
        setTimeout(() => !live.current && v.stop(), FADE * 1000 + 100);
      });
      playing.current = null;
    }
  };

  return (
    <div className={`snd ${on ? "on" : ""} ${hint && !on ? "hint" : ""}`}>
      {/* big callout until the first tap, so nobody misses that the site has music */}
      {hint && !on && (
        <button type="button" className="snd-hint" onClick={toggle} aria-hidden tabIndex={-1}>
          <span className="snd-hint-text truck">
            Recommended
            <br />
            with music on
          </span>
          <span className="snd-arrow" aria-hidden>
            ➜
          </span>
        </button>
      )}
      {on && now && (
        <span className="snd-now" aria-live="polite">
          ♪ {now}
        </span>
      )}
      <button className="snd-btn" onClick={toggle} aria-pressed={on} aria-label={on ? "Turn music off" : "Turn music on (best with sound on)"}>
        {on ? (
          <span className="snd-eq" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <span aria-hidden>🔇</span>
        )}
      </button>
    </div>
  );
}
