// Builds and downloads a one-event .ics calendar file.
export function downloadIcs({ start, hours, title, location, description, file }: {
  start: string;
  hours: number;
  title: string;
  location: string;
  description?: string;
  file: string;
}) {
  const s = new Date(start);
  const e = new Date(s.getTime() + hours * 3600 * 1000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escape = (t: string) => t.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\;");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ApurvaWedsManmohan//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(s)}-${file}@apurva-weds-manmohan`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(s)}`,
    `DTEND:${stamp(e)}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    description ? `DESCRIPTION:${escape(description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = `${file}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
