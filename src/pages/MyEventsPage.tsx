import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/events";
import type { Event } from "../types";

export function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await eventsApi.listMine();
      setEvents(data.events);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await eventsApi.remove(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <p>Loading your events...</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1>My Events</h1>
      <div style={{ marginBottom: 16 }}>
        <Link to="/events/new">+ Create Event</Link>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {events.map((event: any) => (
            <div key={event.id} style={cardStyle}>
              <h3>{event.title}</h3>
              <p><b>Status:</b> {event.status}</p>
              <p><b>Location:</b> {event.location || "-"}</p>
              <p><b>Start:</b> {new Date(event.startDate).toLocaleString()}</p>
              <p><b>Capacity:</b> {event.capacity}</p>
              <p><b>Bookings:</b> {event.bookingsCount ?? 0}</p>
              <p><b>Seats left:</b> {event.seatsLeft ?? "-"}</p>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Link to={`/events/${event.id}/edit`}>Edit</Link>
                <Link to={`/events/${event.id}/attendees`}>Attendees</Link>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 16,
  background: "#fff",
};