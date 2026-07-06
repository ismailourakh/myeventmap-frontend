import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>

      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        <Link to="/apply-organizer">Apply to Become Organizer</Link>
      </div>

      {user?.role === "ORGANIZER" && (
        <div style={{ marginTop: 20 }}>
          <p>You can now build event management pages here.</p>
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div style={{ marginTop: 20 }}>
          <p>You can now build the admin applications dashboard here.</p>
        </div>
      )}
      {user?.role === "ORGANIZER" && (
          <div style={{ marginTop: 20 }}>
            <Link to="/events/mine">My Events</Link>
          </div>
        )}

        {user?.role === "ADMIN" && (
          <div style={{ marginTop: 20 }}>
            <Link to="/admin/applications">Review Organizer Applications</Link>
          </div>
        )}
        </div>
  );
}