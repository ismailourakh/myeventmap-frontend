import { useState } from "react";
import { organizerApi } from "../api/organizer";
import { getErrorMessage } from "../lib/httpError";

export function ApplyOrganizerPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    try {
      await organizerApi.apply({ message });
      setStatus("Application submitted successfully.");
      setMessage("");
    } catch (err: unknown) {
      setStatus(getErrorMessage(err, "Failed to submit application"));
    }
  };

  return (
    <div style={formStyle}>
      <h1>Apply to Become Organizer</h1>
      <form onSubmit={submit} style={formStack}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Why do you want to become an organizer?"
          rows={5}
        />
        <button type="submit">Submit Application</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

const formStyle: React.CSSProperties = { maxWidth: 600, margin: "40px auto" };
const formStack: React.CSSProperties = { display: "grid", gap: 12 };