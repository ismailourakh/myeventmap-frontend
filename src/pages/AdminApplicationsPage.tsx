/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { organizerApi } from "../api/organizer";
import type { OrganizerApplication } from "../types";
import { getErrorMessage } from "../lib/httpError";
import "../styles/manage.css";

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await organizerApi.listApplications("PENDING");
      setApplications(data.applications);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const approve = async (id: string) => {
    setProcessingId(id);

    try {
      await organizerApi.approve(id);
      setApplications((prev) => prev.filter((application) => application.id !== id));
    } catch (err) {
      alert(getErrorMessage(err, "Approve failed"));
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id: string) => {
    setProcessingId(id);

    try {
      await organizerApi.reject(id);
      setApplications((prev) => prev.filter((application) => application.id !== id));
    } catch (err) {
      alert(getErrorMessage(err, "Reject failed"));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="standby-screen">
        <div className="standby-content">
          <div className="standby-ring" />
          <p className="standby-text">Loading applications&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ops-page">
      <div className="ops-container">
        <p className="ops-eyebrow">Backstage Review</p>
        <h1 className="ops-title">Organizer Applications</h1>
        <p className="ops-sub">
          Review organizer requests and approve trusted event creators before
          they get keys to the booth.
        </p>

        <div className="readout-grid">
          <div className="readout-tile">
            <div className="readout-icon">📋</div>
            <div className="readout-value">{applications.length}</div>
            <div className="readout-label">Pending Applications</div>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginTop: "2rem" }}>{error}</div>}

        {applications.length === 0 ? (
          <div className="empty-block">
            <div className="empty-block-icon">🎉</div>
            <h2 className="empty-block-title">Everything Is Up to Date</h2>
            <p className="empty-block-sub">There are no pending organizer applications.</p>
          </div>
        ) : (
          <div className="dossier-grid">
            {applications.map((app) => (
              <div key={app.id} className="dossier-card">
                <div className="dossier-top">
                  <div className="dossier-identity">
                    <div className="dossier-avatar">
                      {(app.user?.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="dossier-name">{app.user?.name}</h2>
                      <p className="dossier-email">{app.user?.email}</p>
                    </div>
                  </div>

                  <div className="dossier-side">
                    <span className="status-pill status-pill--pending">
                      <span className="status-pill-dot" />
                      {app.status}
                    </span>

                    <div className="dossier-actions">
                      <button
                        disabled={processingId === app.id}
                        onClick={() => approve(app.id)}
                        className="btn-approve"
                      >
                        {processingId === app.id ? "Processing…" : "Approve"}
                      </button>

                      <button
                        disabled={processingId === app.id}
                        onClick={() => reject(app.id)}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>

                <div className="dossier-motivation">
                  <p className="dossier-motivation-label">Motivation</p>
                  <p className="dossier-motivation-text">
                    {app.message || "No message provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}