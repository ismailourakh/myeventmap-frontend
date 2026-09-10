import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../lib/httpError";
import "../styles/forms.css";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await authApi.register({ name, email, password });
      setAuth(data.user, data.token);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Register failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* LEFT — marquee panel */}
      <div className="auth-panel">
        <div className="auth-panel-bulbs" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="auth-panel-bulb" style={{ ["--bulb-i" as string]: i }} />
          ))}
        </div>

        <p className="auth-panel-eyebrow">New Admission</p>
        <h1 className="auth-panel-title">Get Your Pass</h1>
        <p className="auth-panel-sub">
          Create an account to discover unforgettable experiences, book
          tickets instantly, and connect with amazing events.
        </p>

        <div className="auth-checklist">
          <div className="auth-checklist-item">
            <span className="auth-checklist-text">Reserve tickets in seconds</span>
          </div>
          <div className="auth-checklist-item">
            <span className="auth-checklist-text">Discover nearby premium events</span>
          </div>
          <div className="auth-checklist-item">
            <span className="auth-checklist-text">Become an event organizer anytime</span>
          </div>
        </div>
      </div>

      {/* RIGHT — admission form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-mark">🎟</div>
            <p className="auth-card-eyebrow">Admission</p>
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-sub">Start your journey today.</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div className="form-field">
              <label className="form-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {error && <div className="form-banner is-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-footer-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}