import { useEffect } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import "./styles/app.css";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ApplyOrganizerPage } from "./pages/ApplyOrganizerPage";
import { MyEventsPage } from "./pages/MyEventsPage";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EditEventPage } from "./pages/EditEventPage";
import { AdminApplicationsPage } from "./pages/AdminApplicationsPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { EventAttendeesPage } from "./pages/EventAttendeesPage";

function App() {
  const { user, token, initialized, loadFromStorage, logout } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!initialized) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Loading&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* NAVBAR */}
      <header className="app-navbar">
        <div className="app-navbar-inner">
          {/* Logo */}
          <Link to="/" className="app-logo">
            <span className="app-logo-mark">🎟</span>
            <span className="app-logo-text">
              My Event <span className="accent">Map</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="app-nav">
            <Link to="/" className="app-nav-link">
              Home
            </Link>

            {token && (
              <Link to="/dashboard" className="app-nav-link">
                Dashboard
              </Link>
            )}

            {token && user?.role === "PARTICIPANT" && (
              <Link to="/my-bookings" className="app-nav-link">
                My Bookings
              </Link>
            )}
          </nav>

          {/* Auth actions */}
          {!token ? (
            <div className="app-auth-group">
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-signal">
                Register
              </Link>
            </div>
          ) : (
            <div className="app-auth-group">
              <span className="app-user-pill">
                <span className="app-user-pill-dot" />
                {user?.name} &middot; {user?.role}
              </span>
              <button type="button" onClick={logout} className="btn-outline-sold">
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />

          <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />

          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />

          <Route
            path="/apply-organizer"
            element={token ? <ApplyOrganizerPage /> : <Navigate to="/login" />}
          />

          <Route path="/events/mine" element={token ? <MyEventsPage /> : <Navigate to="/login" />} />

          <Route path="/events/new" element={token ? <CreateEventPage /> : <Navigate to="/login" />} />

          <Route
            path="/events/:id/edit"
            element={token ? <EditEventPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/events/:id/attendees"
            element={token ? <EventAttendeesPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/admin/applications"
            element={
              token && user?.role === "ADMIN" ? (
                <AdminApplicationsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/my-bookings" element={token ? <MyBookingsPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;