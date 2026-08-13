import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventsApi } from "../api/events";
import { MapPicker } from "../components/MapPicker";
import type { EventStatus } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/manage.css";

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
      setError(
        "Please choose the exact event location on the map (click the map or use 'Find on map')."
      );
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
    <div className="ops-page">
      <div className="ops-container ops-container--narrow">
        <p className="ops-eyebrow">New Listing</p>
        <h1 className="ops-title">Create Event</h1>
        <p className="ops-sub">Fill out the details below to put a new event on the board.</p>

        <form onSubmit={handleSubmit} className="stage-form-card">
          <div className="field-group">
            <div>
              <label className="field-label" htmlFor="ce-title">Title</label>
              <input
                id="ce-title"
                className="field-input"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="ce-description">Description</label>
              <textarea
                id="ce-description"
                rows={4}
                placeholder="Describe your event…"
                className="field-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="ce-location">Location</label>
              <input
                id="ce-location"
                placeholder="Address / Venue name"
                className="field-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="ce-postcode">UK Postcode</label>
              <input
                id="ce-postcode"
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

            <label className="field-checkbox-row" htmlFor="ce-food">
              <input
                id="ce-food"
                type="checkbox"
                checked={includesFood}
                onChange={(e) => setIncludesFood(e.target.checked)}
                className="field-checkbox"
              />
              <span className="field-checkbox-label">Food included</span>
            </label>

            <div className="field-row-2">
              <div>
                <label className="field-label" htmlFor="ce-start">Start Date</label>
                <input
                  id="ce-start"
                  type="datetime-local"
                  className="field-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="ce-end">End Date</label>
                <input
                  id="ce-end"
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
                <label className="field-label" htmlFor="ce-capacity">Capacity</label>
                <input
                  id="ce-capacity"
                  type="number"
                  min={1}
                  className="field-input"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="ce-status">Status</label>
                <select
                  id="ce-status"
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

          <button type="submit" disabled={loading || !mapUrl} className="btn-submit">
            {loading ? "Creating…" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}