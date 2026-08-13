import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/events";
import type { Event, EventStatus } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/myevents.css";

const STATUS_STYLES: Record<EventStatus, string> = {
  DRAFT: "status-pill--draft",
  PUBLISHED: "status-pill--published",
  CANCELLED: "status-pill--cancelled",
};

export function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        const { data } = await eventsApi.listMine();
        if (!cancelled) setEvents(data.events);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load your events"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    try {
      await eventsApi.remove(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      alert(getErrorMessage(err, "Delete failed"));
    }
  };

  if (loading) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Loading your events&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ops-page">
      <div className="ops-container">
        <div className="ops-header-row">
          <div>
            <p className="ops-eyebrow">Production Board</p>
            <h1 className="ops-title">My Events</h1>
            <p className="ops-sub">Create, edit, and manage all of your events.</p>
          </div>

          <Link to="/events/new" className="btn-signal">
            + Create Event
          </Link>
        </div>

        {error && <div className="alert" style={{ marginTop: "2rem" }}>{error}</div>}

        {events.length === 0 ? (
          <div className="empty-block">
            <div className="empty-block-icon">📅</div>
            <h2 className="empty-block-title">No Events Yet</h2>
            <p className="empty-block-sub">Create your first event to start welcoming attendees.</p>
          </div>
        ) : (
          <div className="show-grid">
            {events.map((event) => {
              const seats = event.seatsLeft ?? event.availableSeats ?? 0;
              const statusClass = STATUS_STYLES[event.status] ?? "status-pill--draft";

              return (
                <article key={event.id} className="show-card">
                  <div className="show-card-head">
                    <h2 className="show-card-title">{event.title}</h2>
                    <span className={`status-pill ${statusClass}`}>
                      <span className="status-pill-dot" />
                      {event.status}
                    </span>
                  </div>

                  <div className="show-card-body">
                    <div className="spec-grid">
                      <div className="spec-item">
                        <p className="spec-label">📍 Location</p>
                        <p className="spec-value">{event.location || "—"}</p>
                      </div>
                      <div className="spec-item">
                        <p className="spec-label">📮 Postcode</p>
                        <p className="spec-value">{event.postcode || "—"}</p>
                      </div>
                      <div className="spec-item">
                        <p className="spec-label">📅 Start</p>
                        <p className="spec-value">{new Date(event.startDate).toLocaleString()}</p>
                      </div>
                      <div className="spec-item">
                        <p className="spec-label">👥 Capacity</p>
                        <p className="spec-value">{event.capacity}</p>
                      </div>
                      <div className="spec-item">
                        <p className="spec-label">🎟 Bookings</p>
                        <p className="spec-value">{event.bookingsCount ?? 0}</p>
                      </div>
                      <div className="spec-item">
                        <p className="spec-label">💺 Seats Left</p>
                        <p className="spec-value">{seats}</p>
                      </div>
                    </div>

                    {event.mapUrl && (
                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="show-map-link"
                      >
                        📍 Open map →
                      </a>
                    )}

                    <div className="show-actions">
                      <Link to={`/events/${event.id}/edit`} className="show-action show-action--edit">
                        Edit
                      </Link>
                      <Link
                        to={`/events/${event.id}/attendees`}
                        className="show-action show-action--attendees"
                      >
                        Attendees
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className="show-action show-action--delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}