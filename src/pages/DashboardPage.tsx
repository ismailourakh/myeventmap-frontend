import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}

        <div className="rounded-3xl bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E2C8A7] p-10 text-white shadow-xl">

          <p className="text-lg opacity-90">
            Welcome back 👋
          </p>

          <h1 className="mt-2 text-5xl font-black">
            {user?.name}
          </h1>

          <div className="mt-6 inline-flex rounded-full bg-white/20 px-5 py-2 text-lg font-semibold backdrop-blur">
            {user?.role}
          </div>

        </div>
        {/* Quick Actions */}

        <div className="mt-12">

          <h2 className="mb-6 text-3xl font-bold text-[#3E3025]">
            Quick Actions
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {/* Apply */}

            {user?.role !== "ORGANIZER" && (<Link
              to="/apply-organizer"
              className="group rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-5xl">🚀</div>

              <h3 className="mt-5 text-2xl font-bold text-[#3E3025]">
                Become an Organizer
              </h3>

              <p className="mt-3 text-[#7A6757]">
                Apply to create and manage your own events.
              </p>

            </Link>)}

            {/* Organizer */}

            {user?.role === "ORGANIZER" && (

              <Link
                to="/events/mine"
                className="group rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div className="text-5xl">📅</div>

                <h3 className="mt-5 text-2xl font-bold text-[#3E3025]">
                  My Events
                </h3>

                <p className="mt-3 text-[#7A6757]">
                  View, edit, and manage all your events.
                </p>

              </Link>

            )}

            {/* Admin */}

            {user?.role === "ADMIN" && (

              <Link
                to="/admin/applications"
                className="group rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div className="text-5xl">🛡️</div>

                <h3 className="mt-5 text-2xl font-bold text-[#3E3025]">
                  Organizer Applications
                </h3>

                <p className="mt-3 text-[#7A6757]">
                  Review and approve organizer requests.
                </p>

              </Link>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}