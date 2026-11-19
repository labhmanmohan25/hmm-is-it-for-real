import { forwardRef } from "react";

// Faceted, truck-art style heart (after the Tota-Myna poster): angular outline, alternating
// red/pink facets, neon double border. `fillRef` points at the clip rect so the heart can be
// filled bottom-up like a meter; `full` renders it already filled.
const outline = "100,174 10,84 10,38 44,8 80,8 100,30 120,8 156,8 190,38 190,84";
const center: [number, number] = [100, 92];
const pts = outline.split(" ").map((p) => p.split(",").map(Number) as [number, number]);
const facetColors = ["#d90429", "#ff2e88", "#b5002a", "#ff4d6d", "#e01e37", "#ff2e88", "#9d0208", "#ff4d6d", "#d90429", "#ff2e88"];

type Props = { className?: string; id: string; full?: boolean };

const AngularHeart = forwardRef<SVGRectElement, Props>(function AngularHeart({ className, id, full }, fillRef) {
  return (
    <svg viewBox="0 0 200 182" className={className} aria-hidden>
      <defs>
        <clipPath id={`${id}-fill`}>
          <rect ref={fillRef} x="0" y={full ? 0 : 182} width="200" height="182" />
        </clipPath>
      </defs>

      {/* empty heart */}
      <polygon points={outline} fill="#1b1214" stroke="#d4ff3a" strokeWidth="5" strokeLinejoin="miter" />

      {/* faceted fill, revealed by the meter */}
      <g clipPath={`url(#${id}-fill)`}>
        {pts.map((p, i) => {
          const q = pts[(i + 1) % pts.length];
          return <polygon key={i} points={`${center[0]},${center[1]} ${p[0]},${p[1]} ${q[0]},${q[1]}`} fill={facetColors[i]} />;
        })}
        <polygon points="100,62 130,92 100,122 70,92" fill="#ffd60a" />
        <polygon points="100,74 118,92 100,110 82,92" fill="#d90429" />
        <circle cx="100" cy="92" r="5" fill="#d4ff3a" />
        {[40, 64, 136, 160].map((x) => (
          <polygon key={x} points={`${x},28 ${x + 7},40 ${x - 7},40`} fill="#ffd60a" />
        ))}
      </g>

      <polygon points={outline} fill="none" stroke="#d4ff3a" strokeWidth="5" strokeLinejoin="miter" />
      <polygon points="100,160 22,82 22,43 48,20 76,20 100,44 124,20 152,20 178,43 178,82" fill="none" stroke="#ffd60a" strokeWidth="1.6" strokeDasharray="5 4" />
    </svg>
  );
});

export default AngularHeart;

// Small-size version of the same heart for inline text and particle bursts: same silhouette,
// only the two big facets + centre diamond so it stays crisp at 1em.
export function HeartGlyph({ className, tint = "#ff2e88" }: { className?: string; tint?: string }) {
  return (
    <svg viewBox="0 0 200 182" className={className} aria-hidden>
      <polygon points="100,174 10,84 10,38 44,8 80,8 100,30 100,174" fill="#d90429" />
      <polygon points="100,174 190,84 190,38 156,8 120,8 100,30 100,174" fill={tint} />
      <polygon points="100,62 130,92 100,122 70,92" fill="#ffd60a" />
      <polygon points={outline} fill="none" stroke="#d4ff3a" strokeWidth="12" strokeLinejoin="miter" />
    </svg>
  );
}
