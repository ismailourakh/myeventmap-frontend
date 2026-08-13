import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "../api/events";
import { MapPicker } from "../components/MapPicker";
import type { Event, EventStatus } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/manage.css";

export function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

    void (async () => {
      try {
        const { data } = await eventsApi.getMineById(id);
        const e: Event = data.event;

        setTitle(e.title);
        setDescription(e.description || "");
        setLocation(e.location || "");
        setPostcode(e.postcode || "");
        setMapUrl(e.mapUrl || "");
        setIncludesFood(Boolean(e.includesFood));
        setStartDate(new Date(e.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(e.endDate).toISOString().slice(0, 16));
        setCapacity(e.capacity);
        setStatus(e.status);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load event"));
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update event"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Loading event&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ops-page">
      <div className="ops-container ops-container--narrow">
        <p className="ops-eyebrow">Revise Listing</p>
        <h1 className="ops-title">Edit Event</h1>
        <p className="ops-sub">Update the details below — changes apply as soon as you save.</p>

        <form onSubmit={handleSubmit} className="stage-form-card">
          <div className="field-group">
            <div>
              <label className="field-label" htmlFor="ee-title">Title</label>
              <input
                id="ee-title"
                className="field-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="ee-description">Description</label>
              <textarea
                id="ee-description"
                rows={4}
                className="field-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="ee-location">Location</label>
              <input
                id="ee-location"
                placeholder="Address / Venue name"
                className="field-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="ee-postcode">UK Postcode</label>
              <input
                id="ee-postcode"
                placeholder="e.g. SW1A 1AA"
                className="field-input"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Pick Location</label>
              <div className="field-map-wrap">
                <MapPicker
                  postcode={postcode}
                  onPick={({ mapUrl: selectedMapUrl, postcode: pickedPostcode }) => {
                    setMapUrl(selectedMapUrl);
                    if (pickedPostcode) setPostcode(pickedPostcode);
                  }}
                  onPostcodeChange={setPostcode}
                />
              </div>
            </div>

            <label className="field-checkbox-row" htmlFor="ee-food">
              <input
                id="ee-food"
                type="checkbox"
                checked={includesFood}
                onChange={(e) => setIncludesFood(e.target.checked)}
                className="field-checkbox"
              />
              <span className="field-checkbox-label">Food included</span>
            </label>

            <div className="field-row-2">
              <div>
                <label className="field-label" htmlFor="ee-start">Start Date</label>
                <input
                  id="ee-start"
                  type="datetime-local"
                  className="field-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="ee-end">End Date</label>
                <input
                  id="ee-end"
                  type="datetime-local"
                  className="field-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-row-2">
              <div>
                <label className="field-label" htmlFor="ee-capacity">Capacity</label>
                <input
                  id="ee-capacity"
                  type="number"
                  min={1}
                  className="field-input"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="ee-status">Status</label>
                <select
                  id="ee-status"
                  className="field-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
          </div>

          <button type="submit" disabled={saving || !mapUrl} className="btn-submit">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}