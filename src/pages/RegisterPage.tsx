import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      const { data } = await authApi.register({
        name,
        email,
        password,
      });

      setAuth(data.user, data.token);

      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Register failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F4EE]">

      {/* Left */}

      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#A67C52] via-[#C89B6D] to-[#F2DEC8] p-16">

        <div className="max-w-lg text-white">

          <div className="text-7xl mb-8">✨</div>

          <h1 className="text-5xl font-black leading-tight">
            Join Our Event Community
          </h1>

          <p className="mt-6 text-xl leading-9 text-[#FFF7EF]">
            Create your account to discover unforgettable experiences,
            book tickets instantly, and connect with amazing events.
          </p>

          <div className="mt-14 space-y-6">

            <div className="flex items-center gap-4">
              <div className="text-3xl">🎟</div>
              <span>Reserve tickets in seconds</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl">📍</div>
              <span>Discover nearby premium events</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl">⭐</div>
              <span>Become an event organizer anytime</span>
            </div>

          </div>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center justify-center p-8">

        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

          <div className="text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A67C52] to-[#8C5A2B] text-4xl text-white shadow-lg">
              🎟
            </div>

            <h2 className="text-4xl font-black text-[#3E3025]">
              Create Account
            </h2>

            <p className="mt-3 text-[#7A6757]">
              Start your journey today.
            </p>

          </div>

          <form
            onSubmit={submit}
            className="mt-10 space-y-6"
          >

            <div>

              <label className="mb-2 block font-semibold text-[#5A4332]">
                Full Name
              </label>

              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D8C6B4]
                  bg-[#FCFAF8]
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-[#A67C52]
                  focus:ring-4
                  focus:ring-[#E9D8C7]
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold text-[#5A4332]">
                Email Address
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D8C6B4]
                  bg-[#FCFAF8]
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-[#A67C52]
                  focus:ring-4
                  focus:ring-[#E9D8C7]
                "
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold text-[#5A4332]">
                Password
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D8C6B4]
                  bg-[#FCFAF8]
                  px-5
                  py-4
                  outline-none
                  transition
                  focus:border-[#A67C52]
                  focus:ring-4
                  focus:ring-[#E9D8C7]
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
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="mt-8 text-center text-[#7A6757]">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-bold text-[#8C5A2B] hover:underline"
            >
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}