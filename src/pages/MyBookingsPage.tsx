import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await eventsApi.myBookings();
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load bookings");
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
              <h3>{booking.event?.title}</h3>
              <p><b>Location:</b> {booking.event?.location || "-"}</p>
              <p><b>Date:</b> {booking.event?.startDate ? new Date(booking.event.startDate).toLocaleString() : "-"}</p>
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