import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/events";
import type { Event } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    const { data } = await eventsApi.listMine();
    setEvents(data.events);
  };

  useEffect(() => {
    void (async () => {
      try {
        await loadEvents();
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load events"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await eventsApi.remove(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to delete event"));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Events</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {events.map((event) => (
            <div key={event.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <h3>{event.title}</h3>
              <p>Status: {event.status}</p>
              <p>
                Seats left: {event.seatsLeft ?? event.availableSeats} / {event.capacity}
              </p>

              <div style={{ display: "flex", gap: 8 }}>
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