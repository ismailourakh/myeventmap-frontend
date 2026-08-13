import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import { useAuthStore } from "../store/authStore";
import type { Event } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/events.css";

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

  if (loading) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Standby</p>
        </div>
      </div>
    );
  }

  return (
    <div className="callsheet-page">
      <MarqueeHero />

      <div className="callsheet-container">
        {events.length === 0 ? (
          <EmptyHouse />
        ) : (
          <div className="ticket-grid">
            {events.map((event) => (
              <TicketCard
                key={event.id}
                event={event}
                isLoggedIn={Boolean(user)}
                isBooking={bookingId === event.id}
                onBook={() => handleBook(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MarqueeHero() {
  return (
    <section className="marquee-hero">
      <div className="marquee-bulbs" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="marquee-bulb" style={{ ["--bulb-i" as string]: i }} />
        ))}
      </div>
      <p className="marquee-eyebrow">Now Booking</p>
      <h1 className="marquee-title">On the Marquee</h1>
      <p className="marquee-sub">
        Premium events, elegant venues, and memories worth the price of admission.
        Reserve your seat before the house fills.
      </p>
    </section>
  );
}

function EmptyHouse() {
  return (
    <div className="empty-house">
      <div className="empty-house-icon">🎫</div>
      <h2 className="empty-house-title">The House Is Dark</h2>
      <p className="empty-house-sub">Nothing on the board tonight — check back soon.</p>
    </div>
  );
}

interface TicketCardProps {
  event: Event;
  isLoggedIn: boolean;
  isBooking: boolean;
  onBook: () => void;
}

function TicketCard({ event, isLoggedIn, isBooking, onBook }: TicketCardProps) {
  const seatsLeft = event.seatsLeft ?? event.availableSeats ?? 0;
  const full = seatsLeft <= 0;
  const capacity = event.capacity > 0 ? event.capacity : 1;
  const percent = Math.max(0, Math.min(100, (seatsLeft / capacity) * 100));

  const gaugeStatus = full ? "is-low" : percent < 25 ? "is-low" : percent < 60 ? "is-mid" : "is-open";

  return (
    <article className="ticket-card">
      <div className="ticket-banner">
        {full && <span className="ticket-stamp">Sold Out</span>}
        <span className="ticket-class">Premium Event</span>
      </div>

      <div className="ticket-tear" />

      <div className="ticket-body">
        <h2 className="ticket-title">{event.title}</h2>
        <p className="ticket-desc">{event.description || "No description available."}</p>

        <div className="ticket-meta">
          <span className="ticket-chip">📍 {event.location || "Unknown"}</span>
          <span className="ticket-chip">📮 {event.postcode || "—"}</span>
          <span className="ticket-chip">{event.includesFood ? "🍽 Food included" : "☕ No food"}</span>
        </div>

        <div className="gauge">
          <div className="gauge-row">
            <span>Seats left</span>
            <span className={`gauge-count ${gaugeStatus}`}>
              {seatsLeft} / {event.capacity}
            </span>
          </div>
          <div className="gauge-track">
            <div className={`gauge-fill ${gaugeStatus}`} style={{ width: `${percent}%` }} />
          </div>
        </div>

        {event.mapUrl && (
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="ticket-map-link"
          >
            📍 Open map →
          </a>
        )}

        <div className="ticket-action">
          {!isLoggedIn ? (
            <div className="btn-login-notice">Sign in to reserve</div>
          ) : (
            <button
              type="button"
              className="btn-reserve"
              disabled={isBooking || full}
              onClick={onBook}
            >
              {full ? "Sold out" : isBooking ? "Reserving…" : "Reserve seat"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}