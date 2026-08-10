import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../lib/httpError";

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
      const { data } = await authApi.login({
        email,
        password,
      });

      setAuth(data.user, data.token);

      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F4EE]">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#8C5A2B] via-[#B98B5F] to-[#E6C9A8] p-20 text-white">

        <div className="max-w-lg">

          <div className="mb-8 text-7xl">
            🎟
          </div>

          <h1 className="text-5xl font-black leading-tight">
            Welcome Back
          </h1>

          <p className="mt-6 text-xl leading-9 text-[#FFF7EF]">
            Sign in to discover premium events, reserve your seats,
            and manage all your bookings in one beautiful place.
          </p>

          <div className="mt-14 space-y-5">

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <span>Book events instantly</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <span>Manage your tickets</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <span>Exclusive organizer experiences</span>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center justify-center p-8">

        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

          <div className="text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A67C52] to-[#8C5A2B] text-4xl text-white shadow-lg">
              🎟
            </div>

            <h2 className="text-4xl font-black text-[#3E3025]">
              Login
            </h2>

            <p className="mt-3 text-[#7A6757]">
              Welcome back! Please sign in.
            </p>

          </div>

          <form
            onSubmit={submit}
            className="mt-10 space-y-6"
          >

            <div>

              <label className="mb-2 block font-semibold text-[#5A4332]">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D7C3AE]
                  bg-[#FCFAF8]
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-[#A67C52]
                  focus:ring-4
                  focus:ring-[#EAD8C7]
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold text-[#5A4332]">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D7C3AE]
                  bg-[#FCFAF8]
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-[#A67C52]
                  focus:ring-4
                  focus:ring-[#EAD8C7]
                "
              />

            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-[#A67C52]
                to-[#8C5A2B]
                py-4
                text-lg
                font-bold
                text-white
                shadow-lg
                transition
                duration-300
                hover:scale-[1.02]
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-8 text-center text-[#7A6757]">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-bold text-[#8C5A2B] hover:underline"
            >
              Create one
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}