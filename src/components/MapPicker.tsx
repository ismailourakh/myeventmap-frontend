import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lng: number };

type Props = {
  postcode: string;
  onPick: (v: { lat: number; lng: number; mapUrl: string; postcode?: string }) => void;
  onPostcodeChange: (postcode: string) => void;
  initialCenter?: LatLng;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ center }: { center: LatLng }) {
  const map = useMap();
  map.setView([center.lat, center.lng], 15);
  return null;
}

function ClickHandler({ onClickPick }: { onClickPick: (point: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClickPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function buildGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

async function geocodeUkPostcode(postcode: string): Promise<LatLng | null> {
  const q = encodeURIComponent(`${postcode}, UK`);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=gb&q=${q}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

async function reverseGeocodeUkPostcode(lat: number, lng: number): Promise<string | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data?.address?.postcode === "string" ? data.address.postcode : null;
}

export function MapPicker({
  postcode,
  onPick,
  onPostcodeChange,
  initialCenter = { lat: 51.5074, lng: -0.1278 },
}: Props) {
  const [center, setCenter] = useState<LatLng>(initialCenter);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const handleFindOnMap = async () => {
    const pc = postcode.trim();
    if (!pc) {
      setGeoError("Please enter a postcode first.");
      return;
    }

    setLoading(true);
    setGeoError("");

    try {
      const point = await geocodeUkPostcode(pc);
      if (!point) {
        setGeoError("Postcode not found in UK. Try a valid postcode (e.g. SW1A 1AA).");
        return;
      }

      setCenter(point);
      setMarker(point);
      onPick({
        ...point,
        postcode: pc,
        mapUrl: buildGoogleMapsUrl(point.lat, point.lng),
      });
    } catch {
      setGeoError("Failed to find postcode location.");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (point: LatLng) => {
    setCenter(point);
    setMarker(point);
    setGeoError("");

    const mapUrl = buildGoogleMapsUrl(point.lat, point.lng);
    onPick({ ...point, mapUrl });

    try {
      const pc = await reverseGeocodeUkPostcode(point.lat, point.lng);
      if (pc) {
        onPostcodeChange(pc);
        onPick({ ...point, postcode: pc, mapUrl });
      }
    } catch {
      // keep silent: location is already selected
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={handleFindOnMap} disabled={loading}>
          {loading ? "Finding..." : "Find on map"}
        </button>
      </div>

      {geoError && <p style={{ color: "crimson", margin: "4px 0 8px" }}>{geoError}</p>}

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: 320, width: "100%", borderRadius: 8, overflow: "hidden" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        <ClickHandler onClickPick={handleMapClick} />
        {marker && <Marker position={[marker.lat, marker.lng]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}