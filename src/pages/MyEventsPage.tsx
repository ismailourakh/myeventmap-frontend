import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/events";
import type { Event } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        const { data } = await eventsApi.listMine();

        if (!cancelled) {
          setEvents(data.events);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getErrorMessage(err, "Failed to load your events")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    try {
      await eventsApi.remove(id);

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );
    } catch (err) {
      alert(getErrorMessage(err, "Delete failed"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D8B58A] border-t-[#8C5A2B]" />
          <p className="mt-5 text-lg font-semibold text-[#6B4E35]">
            Loading your events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Hero */}

        <div className="rounded-3xl bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E2C8A7] p-10 text-white shadow-xl">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-5xl font-black">
                My Events
              </h1>

              <p className="mt-4 text-lg text-[#FFF7EF]">
                Create, edit, and manage all of your events.
              </p>
            </div>

            <Link
              to="/events/new"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-white
                px-7
                py-4
                text-lg
                font-bold
                text-[#8C5A2B]
                shadow-lg
                transition
                hover:scale-105
              "
            >
              + Create Event
            </Link>

          </div>

        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-16 text-center shadow-xl">

            <div className="text-7xl">
              📅
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#3E3025]">
              No Events Yet
            </h2>

            <p className="mt-3 text-[#7A6757]">
              Create your first event to start welcoming attendees.
            </p>

          </div>
        ) : (

          <div className="mt-10 grid gap-8 lg:grid-cols-2">

            {events.map((event) => {

              const seats =
                event.seatsLeft ??
                event.availableSeats ??
                0;

              return (

                <div
                  key={event.id}
                  className="
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >

                  {/* Header */}

                  <div className="bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E2C8A7] p-7 text-white">

                    <div className="flex items-start justify-between">

                      <div>

                        <h2 className="text-3xl font-black">
                          {event.title}
                        </h2>

                        <div className="mt-3 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                          {event.status}
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Body */}

                  <div className="space-y-6 p-7">

                    <div className="grid gap-5 sm:grid-cols-2">

                      <Info
                        title="📍 Location"
                        value={event.location || "-"}
                      />

                      <Info
                        title="📮 Postcode"
                        value={event.postcode || "-"}
                      />

                      <Info
                        title="📅 Start"
                        value={new Date(
                          event.startDate
                        ).toLocaleString()}
                      />

                      <Info
                        title="👥 Capacity"
                        value={String(event.capacity)}
                      />

                      <Info
                        title="🎟 Bookings"
                        value={String(event.bookingsCount ?? 0)}
                      />

                      <Info
                        title="💺 Seats Left"
                        value={String(seats)}
                      />

                    </div>

                    {event.mapUrl && (

                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          rounded-xl
                          bg-[#F4E8DB]
                          px-5
                          py-3
                          font-semibold
                          text-[#8C5A2B]
                          transition
                          hover:bg-[#EBD8C3]
                        "
                      >
                        📍 Open Map
                      </a>

                    )}

                    <div className="grid gap-3 sm:grid-cols-3">

                      <Link
                        to={`/events/${event.id}/edit`}
                        className="
                          rounded-xl
                          bg-[#A67C52]
                          py-3
                          text-center
                          font-bold
                          text-white
                          transition
                          hover:bg-[#8C5A2B]
                        "
                      >
                        Edit
                      </Link>

                      <Link
                        to={`/events/${event.id}/attendees`}
                        className="
                          rounded-xl
                          bg-[#EFDCC9]
                          py-3
                          text-center
                          font-bold
                          text-[#6D4420]
                          transition
                          hover:bg-[#E5D1BC]
                        "
                      >
                        Attendees
                      </Link>

                      <button
                        onClick={() => handleDelete(event.id)}
                        className="
                          rounded-xl
                          bg-red-600
                          py-3
                          font-bold
                          text-white
                          transition
                          hover:bg-red-700
                        "
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}

type InfoProps = {
  title: string;
  value: string;
};

function Info({ title, value }: InfoProps) {
  return (
    <div className="rounded-2xl bg-[#FCFAF8] p-4">
      <div className="text-sm text-[#8A7B6E]">
        {title}
      </div>

      <div className="mt-2 font-semibold text-[#3E3025]">
        {value}
      </div>
    </div>
  );
}