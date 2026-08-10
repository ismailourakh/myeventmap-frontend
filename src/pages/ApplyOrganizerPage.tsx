import { useState } from "react";
import { organizerApi } from "../api/organizer";
import { getErrorMessage } from "../lib/httpError";

export function ApplyOrganizerPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("");
    setLoading(true);

    try {
      await organizerApi.apply({ message });

      setStatus("🎉 Your application has been submitted successfully!");
      setMessage("");
    } catch (err) {
      setStatus(getErrorMessage(err, "Failed to submit application"));
    } finally {
      setLoading(false);
    }
  };

  const success = status.startsWith("🎉");

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <div className="mx-auto max-w-6xl px-6 py-14">

        {/* Content */}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* Form */}

          <div className="rounded-3xl bg-white p-8 shadow-xl">

            <h2 className="text-3xl font-bold text-[#3E3025]">
              Organizer Application
            </h2>

            <form
              onSubmit={submit}
              className="mt-8 space-y-6"
            >

              <div>

                <label className="mb-3 block text-lg font-semibold text-[#5A4332]">
                  Why do you want to become an organizer?
                </label>

                <textarea
                  rows={8}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your experience, your ideas, and the kinds of events you want to organize..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-[#D7C3AE]
                    bg-[#FCFAF8]
                    px-5
                    py-4
                    leading-7
                    outline-none
                    transition
                    focus:border-[#A67C52]
                    focus:ring-4
                    focus:ring-[#EAD8C7]
                  "
                />

              </div>

              {status && (
                <div
                  className={`rounded-2xl p-4 font-medium ${
                    success
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {status}
                </div>
              )}

              <button
                type="submit"
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
                {loading ? "Submitting..." : "Submit Application"}
              </button>

            </form>

          </div>

          {/* Sidebar */}

          <div className="space-y-6">

            <div className="rounded-3xl bg-white p-7 shadow-lg">

              <div className="text-4xl">⭐</div>

              <h3 className="mt-4 text-2xl font-bold text-[#3E3025]">
                Why Become an Organizer?
              </h3>

              <ul className="mt-5 space-y-4 text-[#6D5A4B]">
                <li>🎟 Create and manage your own events.</li>
                <li>📈 Reach more attendees.</li>
                <li>🤝 Build your community.</li>
                <li>🌍 Promote experiences across your city.</li>
              </ul>

            </div>

            <div className="rounded-3xl bg-white p-7 shadow-lg">

              <div className="text-4xl">📝</div>

              <h3 className="mt-4 text-2xl font-bold text-[#3E3025]">
                Review Process
              </h3>

              <p className="mt-4 leading-8 text-[#6D5A4B]">
                Our team reviews every application individually to ensure
                high-quality events on the platform. We'll notify you once
                your application has been approved or declined.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}