import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export function EventAttendeesPage() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          api.get(`/events/mine/${id}`),
          api.get(`/events/${id}/attendees`),
        ]);

        setEvent(eventRes.data.event);
        setAttendees(attendeesRes.data.attendees);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load attendees");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading attendees...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>Attendees</h1>
      {event && <p><b>Event:</b> {event.title}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {attendees.length === 0 ? (
        <p>No attendees yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {attendees.map((attendee) => (
            <div key={attendee.id} style={cardStyle}>
              <p><b>Name:</b> {attendee.user?.name}</p>
              <p><b>Email:</b> {attendee.user?.email}</p>
              <p><b>Booked at:</b> {new Date(attendee.createdAt).toLocaleString()}</p>
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