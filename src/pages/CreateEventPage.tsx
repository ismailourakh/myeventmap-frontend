import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventsApi } from "../api/events";
import { MapPicker } from "../components/MapPicker";
import type { EventStatus } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function CreateEventPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [postcode, setPostcode] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [includesFood, setIncludesFood] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [status, setStatus] = useState<EventStatus>("DRAFT");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!mapUrl) {
      setError("Please choose exact event location on the map (click map or use 'Find on map').");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);

    try {
      await eventsApi.create({
        title,
        description: description || undefined,
        location: location || undefined,
        postcode: postcode || undefined,
        mapUrl: mapUrl || undefined,
        includesFood,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        capacity,
        status,
      });

      navigate("/events/mine");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to create event"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <input placeholder="Address / Venue name" value={location} onChange={(e) => setLocation(e.target.value)} />

        <input
          placeholder="UK Postcode (e.g. SW1A 1AA)"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />

        <MapPicker
          postcode={postcode}
          onPick={({ mapUrl: selectedMapUrl, postcode: pickedPostcode }) => {
            setMapUrl(selectedMapUrl);
            if (pickedPostcode) setPostcode(pickedPostcode);
          }}
          onPostcodeChange={setPostcode}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={includesFood} onChange={(e) => setIncludesFood(e.target.checked)} />
          Food included
        </label>

        <label>Start date</label>
        <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

        <label>End date</label>
        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <label>Capacity</label>
        <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} required />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button disabled={loading || !mapUrl}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}