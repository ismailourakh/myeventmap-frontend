import { useEffect, useState } from "react";
import { organizerApi } from "../api/organizer";
import type { OrganizerApplication } from "../types";

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await organizerApi.listApplications("PENDING");
      setApplications(data.applications);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const approve = async (id: string) => {
    try {
      await organizerApi.approve(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Approve failed");
    }
  };

  const reject = async (id: string) => {
    try {
      await organizerApi.reject(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Reject failed");
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1>Organizer Applications</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {applications.length === 0 ? (
        <p>No pending applications.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {applications.map((app) => (
            <div key={app.id} style={cardStyle}>
              <h3>{app.user?.name}</h3>
              <p><b>Email:</b> {app.user?.email}</p>
              <p><b>Message:</b> {app.message || "-"}</p>
              <p><b>Status:</b> {app.status}</p>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button onClick={() => approve(app.id)}>Approve</button>
                <button onClick={() => reject(app.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 16,
  background: "#fff",
};