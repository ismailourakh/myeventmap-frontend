import { useState } from "react";
import { organizerApi } from "../api/organizer";
import { getErrorMessage } from "../lib/httpError";
import "../styles/forms.css";

export function ApplyOrganizerPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("");
    setLoading(true);

    try {
      await organizerApi.apply({ message });
      setStatus("Application submitted — we'll be in touch shortly.");
      setSuccess(true);
      setMessage("");
    } catch (err) {
      setStatus(getErrorMessage(err, "Failed to submit application"));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crew-page">
      <div className="crew-container">
        <div className="crew-header">
          <p className="crew-eyebrow">Backstage Access</p>
          <h1 className="crew-title">Apply for a Crew Pass</h1>
          <p className="crew-sub">
            Organizers run the show — creating events, managing the door, and
            building the experience. Tell us why you want in.
          </p>
        </div>

        <div className="crew-grid">
          {/* Form */}
          <div className="crew-form-card">
            <label className="crew-form-label" htmlFor="message">
              Why do you want to become an organizer?
            </label>

            <form onSubmit={submit} className="crew-form">
              <textarea
                id="message"
                rows={8}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your experience, your ideas, and the kinds of events you want to organize…"
                className="form-textarea"
              />

              {status && (
                <div className={`form-banner ${success ? "is-success" : "is-error"}`}>
                  {status}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? "Submitting…" : "Submit application"}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="crew-side">
            <div className="crew-note">
              <span className="crew-note-pin" />
              <p className="crew-note-label">Note 01</p>
              <h3 className="crew-note-title">Why Join the Crew?</h3>
              <ul className="crew-note-list">
                <li> Create and manage your own events.</li>
                <li> Reach more attendees.</li>
                <li> Build your community.</li>
                <li> Promote experiences across your city.</li>
              </ul>
            </div>

            <div className="crew-note">
              <span className="crew-note-pin" />
              <p className="crew-note-label">Note 02</p>
              <h3 className="crew-note-title">Review Process</h3>
              <p className="crew-note-body">
                Our team reviews every application individually to keep event
                quality high. You&rsquo;ll hear back once your application has
                been approved or declined.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}