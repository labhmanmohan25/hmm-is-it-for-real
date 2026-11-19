"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Stop } from "../_lib/mumbai";
import { details as wedding } from "../../../content/details";

// One coloured set of pins: an itinerary day (joined by a dashed route) or a preset like "our places".
export type MapGroup = { id: string; title: string; tag: string; color: string; route: boolean; stops: Stop[] };

function pin(label: string, color: string, kind: string) {
  return L.divIcon({
    className: "",
    html: `<span class="pin pin-${kind}" style="--c:${color}">${label}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

const venueIcon = L.divIcon({
  className: "",
  html: `<span class="pin pin-venue">💍</span>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function FitTo({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length) map.flyToBounds(L.latLngBounds(points), { padding: [40, 40], duration: 1.2 });
  }, [map, points]);
  return null;
}

export default function MapView({ groups }: { groups: MapGroup[] }) {
  const v = wedding.venue;
  const points = useMemo<[number, number][]>(
    () => [[v.lat, v.lng], ...groups.flatMap((g) => g.stops.map((s) => [s.lat, s.lng] as [number, number]))],
    [groups, v.lat, v.lng],
  );

  return (
    <MapContainer center={[19.0, 72.88]} zoom={11} scrollWheelZoom={false} className="mp-map" attributionControl>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
        crossOrigin="anonymous"
      />
      {groups
        .filter((g) => g.route)
        .map((g) => (
          <Polyline key={g.id} positions={g.stops.map((s) => [s.lat, s.lng])} pathOptions={{ color: g.color, weight: 4, dashArray: "8 8", opacity: 0.85 }} />
        ))}
      {groups.map((g) =>
        g.stops.map((s, si) => (
          <Marker key={`${g.id}-${si}`} position={[s.lat, s.lng]} icon={pin(`${g.tag}${si + 1}`, g.color, g.route ? s.kind : "ours")}>
            <Tooltip direction="top" offset={[0, -14]}>
              <b>{s.name}</b>
              <br />
              {s.kind === "eat" ? "🍛 " : "📍 "}
              {s.tip}
            </Tooltip>
          </Marker>
        )),
      )}
      <Marker position={[v.lat, v.lng]} icon={venueIcon}>
        <Tooltip direction="top" offset={[0, -20]} permanent>
          <b>The wedding!</b>
          <br />
          CIDCO, Vashi
        </Tooltip>
      </Marker>
      <FitTo points={points} />
    </MapContainer>
  );
}
