"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Day } from "../mumbai";
import { wedding } from "../wedding";

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

export default function MapView({ days }: { days: Day[] }) {
  const v = wedding.venue;
  const points = useMemo<[number, number][]>(
    () => [[v.lat, v.lng], ...days.flatMap((d) => d.stops.map((s) => [s.lat, s.lng] as [number, number]))],
    [days, v.lat, v.lng],
  );

  return (
    <MapContainer
      center={[19.0, 72.88]}
      zoom={11}
      scrollWheelZoom={false}
      className="mp-map"
      attributionControl
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
        crossOrigin="anonymous"
      />
      {days.map((d) => (
        <Polyline
          key={d.title}
          positions={d.stops.map((s) => [s.lat, s.lng])}
          pathOptions={{ color: d.color, weight: 4, dashArray: "8 8", opacity: 0.85 }}
        />
      ))}
      {days.map((d, di) =>
        d.stops.map((s, si) => (
          <Marker key={`${di}-${s.name}`} position={[s.lat, s.lng]} icon={pin(`${di + 1}.${si + 1}`, d.color, s.kind)}>
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
