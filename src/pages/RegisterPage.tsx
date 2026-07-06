import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../lib/httpError";

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
      navigate("/");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Register failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formStyle}>
      <h1>Register</h1>
      <form onSubmit={submit} style={formStack}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
    </div>
  );
}

const formStyle: React.CSSProperties = { maxWidth: 400, margin: "40px auto" };
const formStack: React.CSSProperties = { display: "grid", gap: 12 };