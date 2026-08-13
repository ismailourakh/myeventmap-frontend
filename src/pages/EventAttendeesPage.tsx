import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Event, EventAttendee } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/manage.css";

export function EventAttendeesPage() {
  const { id } = useParams();

  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    void (async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          api.get<{ event: Event }>(`/events/mine/${id}`),
          api.get<{ attendees: EventAttendee[] }>(`/events/${id}/attendees`),
        ]);

        setEvent(eventRes.data.event);
        setAttendees(attendeesRes.data.attendees);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load attendees"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Loading attendees&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ops-page">
      <div className="ops-container">
        <p className="ops-eyebrow">Guest List</p>
        <h1 className="ops-title">Event Attendees</h1>
        <p className="ops-sub">{event?.title ?? "Your Event"}</p>

        {error && <div className="alert alert-error" style={{ marginTop: "2rem" }}>{error}</div>}

        <div className="readout-grid">
          <div className="readout-tile">
            <div className="readout-icon">👥</div>
            <div className="readout-value">{attendees.length}</div>
            <div className="readout-label">Registered Attendees</div>
          </div>

          <div className="readout-tile">
            <div className="readout-icon">🎟</div>
            <div className="readout-value">{event?.capacity ?? "—"}</div>
            <div className="readout-label">Capacity</div>
          </div>

          <div className="readout-tile">
            <div className="readout-icon">💺</div>
            <div className="readout-value">
              {event?.seatsLeft ?? event?.availableSeats ?? "—"}
            </div>
            <div className="readout-label">Seats Left</div>
          </div>
        </div>

        {attendees.length === 0 ? (
          <div className="empty-block">
            <div className="empty-block-icon">🎫</div>
            <h2 className="empty-block-title">No Attendees Yet</h2>
            <p className="empty-block-sub">Once people book your event they&rsquo;ll appear here.</p>
          </div>
        ) : (
          <div className="manifest-wrap">
            <div className="manifest-scroll">
              <table className="manifest">
                <thead>
                  <tr>
                    <th>Attendee</th>
                    <th>Email</th>
                    <th>Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td>
                        <div className="manifest-attendee">
                          <div className="manifest-avatar">
                            {(attendee.user?.name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="manifest-name">{attendee.user?.name}</div>
                        </div>
                      </td>
                      <td>{attendee.user?.email}</td>
                      <td>{new Date(attendee.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}