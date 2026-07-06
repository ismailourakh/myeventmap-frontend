import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import type { Booking } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await eventsApi.myBookings();
        setBookings(data.bookings);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load bookings"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>My Bookings</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={cardStyle}>
              <h3>{booking.event?.title ?? "-"}</h3>
              <p><b>Location:</b> {booking.event?.location || "-"}</p>
              <p><b>Postcode:</b> {booking.event?.postcode || "-"}</p>
              {booking.event?.mapUrl && (
                <p>
                  <a href={booking.event.mapUrl} target="_blank" rel="noreferrer">
                    Open exact map location
                  </a>
                </p>
              )}
              <p>
                <b>Date:</b>{" "}
                {booking.event?.startDate ? new Date(booking.event.startDate).toLocaleString() : "-"}
              </p>
              <p><b>Booked at:</b> {new Date(booking.createdAt).toLocaleString()}</p>
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