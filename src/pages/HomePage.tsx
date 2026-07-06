import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import { useAuthStore } from "../store/authStore";
import type { Event } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);

  const loadEvents = async () => {
    const { data } = await eventsApi.listPublished();
    setEvents(data.events);
  };

  useEffect(() => {
    void (async () => {
      try {
        await loadEvents();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBook = async (id: string) => {
    setBookingId(id);
    try {
      await eventsApi.book(id);
      alert("Booking successful!");
      await loadEvents();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Booking failed"));
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div>
      <h1>Published Events</h1>

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {events.map((event) => {
            const seatsLeft = event.seatsLeft ?? event.availableSeats ?? 0;
            const full = seatsLeft <= 0;

            return (
              <div key={event.id} style={cardStyle}>
                <h3>{event.title}</h3>
                <p>{event.description || "No description"}</p>
                <p><b>Location:</b> {event.location || "-"}</p>
                <p><b>Postcode:</b> {event.postcode || "-"}</p>
                {event.mapUrl && (
                  <p>
                    <a href={event.mapUrl} target="_blank" rel="noreferrer">
                      Open exact map location
                    </a>
                  </p>
                )}
                <p><b>Food included:</b> {event.includesFood ? "Yes" : "No"}</p>
                <p><b>Capacity:</b> {event.capacity}</p>
                <p><b>Seats left:</b> {seatsLeft}</p>

                {!user ? (
                  <p style={{ color: "#666" }}>Login to book</p>
                ) : (
                  <button onClick={() => handleBook(event.id)} disabled={full || bookingId === event.id}>
                    {full ? "Fully Booked" : bookingId === event.id ? "Booking..." : "Book Ticket"}
                  </button>
                )}
              </div>
            );
          })}
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