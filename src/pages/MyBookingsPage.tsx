import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import type { Booking } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/mybookings.css";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await eventsApi.myBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load bookings"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Loading your tickets&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ops-page">
      <div className="ops-container">
        <p className="ops-eyebrow">Your Wallet</p>
        <h1 className="ops-title">My Tickets</h1>

        {error && <div className="alert" style={{ marginTop: "2rem" }}>{error}</div>}

        {bookings.length === 0 ? (
          <div className="empty-block">
            <div className="empty-block-icon">🎟</div>
            <h2 className="empty-block-title">No Bookings Yet</h2>
            <p className="empty-block-sub">Browse events and reserve your first experience.</p>
          </div>
        ) : (
          <div className="wallet-grid">
            {bookings.map((booking) => (
              <article key={booking.id} className="wallet-ticket">
                <div className="wallet-banner">
                  <span className="wallet-stamp">Admit One</span>
                  <p className="wallet-banner-eyebrow">Event Ticket</p>
                  <h2 className="wallet-banner-title">{booking.event?.title ?? "—"}</h2>
                </div>

                <div className="wallet-tear" />

                <div className="wallet-body">
                  <div className="wallet-info-grid">
                    <div>
                      <p className="wallet-info-label"> Location</p>
                      <p className="wallet-info-value">{booking.event?.location || "—"}</p>
                    </div>
                    <div>
                      <p className="wallet-info-label"> Postcode</p>
                      <p className="wallet-info-value">{booking.event?.postcode || "—"}</p>
                    </div>
                    <div>
                      <p className="wallet-info-label"> Event Date</p>
                      <p className="wallet-info-value">
                        {booking.event?.startDate
                          ? new Date(booking.event.startDate).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="wallet-info-label"> Booked On</p>
                      <p className="wallet-info-value">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {booking.event?.mapUrl && (
                    <a
                      href={booking.event.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="wallet-map-link"
                    >
                       Open event location →
                    </a>
                  )}
                </div>

                <div className="wallet-footer">
                  <span className="wallet-footer-label">Booking ID</span>
                  <code className="wallet-footer-code">
                    {booking.id.slice(0, 8).toUpperCase()}
                  </code>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}