import { wedding } from "../../wedding";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Please submit from this website." }, { status: 403 });
  }
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 12000) throw new Error();
    data = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid RSVP." }, { status: 400 });
  }
  const valid = data && typeof data.name === "string" && data.name.trim().length > 0 && data.name.length <= 120
    && Number.isInteger(data.guests) && data.guests >= 1 && data.guests <= 20
    && ["groom", "bride", "science"].includes(data.side)
    && Array.isArray(data.events) && data.events.length > 0 && data.events.length <= wedding.events.length
    && data.events.every((event: unknown) => wedding.events.some((item) => item.name === event))
    && wedding.meals.every((meal) => ["Veg", "Non-veg"].includes(data.food?.[meal.key]))
    && ["own", "friends-bungalow"].includes(data.stay)
    && ["yes", "no"].includes(data.dance)
    && typeof data.note === "string" && data.note.length <= 2000
    && typeof data.submissionId === "string" && /^[a-f0-9-]{36}$/.test(data.submissionId);
  if (!valid) return Response.json({ error: "Please enter your name, 1–20 guests, select at least one event, choose your stay, and answer the dance question." }, { status: 400 });
  const url = process.env.RSVP_SCRIPT_URL;
  const secret = process.env.RSVP_SCRIPT_SECRET;
  if (!url || !secret) return Response.json({ error: "RSVP is temporarily unavailable. Please try again later." }, { status: 503 });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, name: data.name.trim(), secret }),
      signal: AbortSignal.timeout(25000),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true || typeof result.receipt !== "string") throw new Error();
    return Response.json({ ok: true, receipt: result.receipt });
  } catch {
    return Response.json({ error: "We couldn’t confirm your RSVP. Please retry; your details are still here." }, { status: 502 });
  }
}
