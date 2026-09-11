import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../lib/httpError";
import "../styles/forms.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await authApi.login({ email, password });
      setAuth(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
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

        <h1 className="auth-panel-title">Welcome Back to the House</h1>
        <p className="auth-panel-sub">
          Sign in to pick up where you left off — your seats, your bookings,
          your events, all held at the window.
        </p>

        <div className="auth-checklist">
          <div className="auth-checklist-item">
            <span className="auth-checklist-icon">-</span>
            <span className="auth-checklist-text">Book events instantly</span>
          </div>
          <div className="auth-checklist-item">
            <span className="auth-checklist-icon">-</span>
            <span className="auth-checklist-text">Manage your tickets</span>
          </div>
          <div className="auth-checklist-item">
            <span className="auth-checklist-icon">-</span>
            <span className="auth-checklist-text">Exclusive organizer experiences</span>
          </div>
        </div>
      </div>

      {/* RIGHT — admission form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-card-eyebrow">Admission</p>
            <h2 className="auth-card-title">Sign In</h2>
            <p className="auth-card-sub">Welcome back. Let&rsquo;s get you seated.</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div className="form-field">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {error && <div className="form-banner is-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            Don&rsquo;t have an account?{" "}
            <Link to="/register" className="auth-footer-link">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}