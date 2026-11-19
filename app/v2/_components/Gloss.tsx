// Native-script text with an English line underneath, so every guest can read along.

export function scriptOf(text: string) {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "truck";
}

export default function Gloss({ text, en, className = "" }: { text: string; en: string; className?: string }) {
  return (
    <span className={`gloss ${className}`}>
      <span className={scriptOf(text)}>{text}</span>
      <small className="gloss-en">{en}</small>
    </span>
  );
}
