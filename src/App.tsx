import { useEffect } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

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
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        {token && <Link to="/dashboard" style={linkStyle}>Dashboard</Link>}
        {token && user?.role === "PARTICIPANT" && <Link to="/my-bookings" style={linkStyle}>My Bookings</Link>}
        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>

      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/apply-organizer" element={token ? <ApplyOrganizerPage /> : <Navigate to="/login" />} />

          <Route path="/events/mine" element={token ? <MyEventsPage /> : <Navigate to="/login" />} />
          <Route path="/events/new" element={token ? <CreateEventPage /> : <Navigate to="/login" />} />
          <Route path="/events/:id/edit" element={token ? <EditEventPage /> : <Navigate to="/login" />} />
          <Route path="/events/:id/attendees" element={token ? <EventAttendeesPage /> : <Navigate to="/login" />} />
          <Route path="/admin/applications" element={token && user?.role === "ADMIN" ? <AdminApplicationsPage /> : <Navigate to="/login" />} />
          <Route path="/my-bookings" element={token ? <MyBookingsPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: 16,
  borderBottom: "1px solid #ddd",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
};

export default App;