import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "../api/events";
import { MapPicker } from "../components/MapPicker";

type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [postcode, setPostcode] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [includesFood, setIncludesFood] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [status, setStatus] = useState<EventStatus>("DRAFT");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const { data } = await eventsApi.getMineById(id);
        const e = data.event as any;

        setTitle(e.title);
        setDescription(e.description || "");
        setImageUrl(e.imageUrl || "");
        setLocation(e.location || "");
        setPostcode(e.postcode || "");
        setMapUrl(e.mapUrl || "");
        setIncludesFood(Boolean(e.includesFood));
        setStartDate(new Date(e.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(e.endDate).toISOString().slice(0, 16));
        setCapacity(e.capacity);
        setStatus(e.status);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSaving(true);

    try {
      await eventsApi.update(id, {
        title,
        description: description || null,
        location: location || null,
        postcode: postcode || null,
        mapUrl: mapUrl || null,
        includesFood,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        capacity,
        status,
      });

      navigate("/events/mine");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Edit Event</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <input
          type="url"
          placeholder="Image URL (https://...)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Event preview"
            style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 8 }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        <input
          placeholder="Address / Venue name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

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
  onPostcodeChange={(pc) => setPostcode(pc)}
/>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={includesFood}
            onChange={(e) => setIncludesFood(e.target.checked)}
          />
          Food included
        </label>

        <label>Start date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label>Capacity</label>
        <input
          type="number"
          min={1}
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          required
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button disabled={saving || !mapUrl}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}