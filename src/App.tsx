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
  const {
    user,
    token,
    initialized,
    loadFromStorage,
    logout,
  } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D9B48B] border-t-[#8C5A2B]" />
          <p className="mt-5 text-lg font-semibold text-[#6B4E35]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE]">

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-[#E5D4C4] bg-[#FFFCF8]/90 backdrop-blur-md shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-black text-[#5D3F27]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#A67C52] to-[#7A4E25] text-white shadow-lg">
              🎟
            </div>

            MyEventMap
          </Link>

          {/* Navigation */}

          <nav className="flex items-center gap-2">

            <Link
              to="/"
              className="rounded-xl px-4 py-2 font-medium text-[#5D3F27] transition hover:bg-[#EFE3D5]"
            >
              Home
            </Link>

            {token && (
              <Link
                to="/dashboard"
                className="rounded-xl px-4 py-2 font-medium text-[#5D3F27] transition hover:bg-[#EFE3D5]"
              >
                Dashboard
              </Link>
            )}

            {token && user?.role === "PARTICIPANT" && (
              <Link
                to="/my-bookings"
                className="rounded-xl px-4 py-2 font-medium text-[#5D3F27] transition hover:bg-[#EFE3D5]"
              >
                My Bookings
              </Link>
            )}

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-5 py-2 font-semibold text-[#7A4E25] transition hover:bg-[#EFE3D5]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-[#A67C52] to-[#8C5A2B] px-6 py-2 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">

                <div className="hidden rounded-full bg-[#EFE3D5] px-4 py-2 text-sm font-semibold text-[#6D4420] md:block">
                  {user?.name} • {user?.role}
                </div>

                <button
                  onClick={logout}
                  className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>

              </div>
            )}

          </nav>

        </div>

      </header>

      {/* MAIN */}

      <main>
        <Routes>

          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={!token ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/register"
            element={!token ? <RegisterPage /> : <Navigate to="/" />}
          />

          <Route
            path="/dashboard"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/apply-organizer"
            element={token ? <ApplyOrganizerPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/events/mine"
            element={token ? <MyEventsPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/events/new"
            element={token ? <CreateEventPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/events/:id/edit"
            element={token ? <EditEventPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/events/:id/attendees"
            element={token ? <EventAttendeesPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/admin/applications"
            element={
              token && user?.role === "ADMIN" ? (
                <AdminApplicationsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/my-bookings"
            element={token ? <MyBookingsPage /> : <Navigate to="/login" />}
          />

        </Routes>
      </main>

    </div>
  );
}

export default App;