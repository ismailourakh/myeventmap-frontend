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
    <div className="min-h-screen bg-[#F8F4EE]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E2C8A7] p-10 text-white shadow-xl">
          <h1 className="text-5xl font-black">Create Event</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl bg-white p-8 shadow-xl"
        >
          {/* Title */}
          <div>
            <label className="mb-2 block font-semibold text-[#6B4E35]">
              Title
            </label>

            <input
              className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-semibold text-[#6B4E35]">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Describe your event..."
              className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block font-semibold text-[#6B4E35]">
              Location
            </label>

            <input
              placeholder="Address / Venue name"
              className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Postcode */}
          <div>
            <label className="mb-2 block font-semibold text-[#6B4E35]">
              UK Postcode
            </label>

            <input
              placeholder="e.g. SW1A 1AA"
              className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>

          {/* Map Picker */}
          <div>
            <label className="mb-2 block font-semibold text-[#6B4E35]">
              Pick Location
            </label>

            <MapPicker
              postcode={postcode}
              onPick={({ mapUrl: selectedMapUrl, postcode: pickedPostcode }) => {
                setMapUrl(selectedMapUrl);
                if (pickedPostcode) setPostcode(pickedPostcode);
              }}
              onPostcodeChange={setPostcode}
            />
          </div>

          {/* Food */}
          <label className="flex items-center gap-3 rounded-xl bg-[#F8F4EE] p-4">
            <input
              type="checkbox"
              checked={includesFood}
              onChange={(e) => setIncludesFood(e.target.checked)}
              className="h-5 w-5 accent-[#A67C52]"
            />

            <span className="font-medium text-[#6B4E35]">
              Food included
            </span>
          </label>

          {/* Dates */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-[#6B4E35]">
                Start Date
              </label>

              <input
                type="datetime-local"
                className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#6B4E35]">
                End Date
              </label>

              <input
                type="datetime-local"
                className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Capacity & Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-[#6B4E35]">
                Capacity
              </label>

              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#6B4E35]">
                Status
              </label>

              <select
                className="w-full rounded-xl border border-[#DCC6AE] px-4 py-3 outline-none transition focus:border-[#A67C52] focus:ring-2 focus:ring-[#E8D5C0]"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as EventStatus)
                }
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !mapUrl}
            className="w-full rounded-xl bg-gradient-to-r from-[#A67C52] to-[#8C5A2B] px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}