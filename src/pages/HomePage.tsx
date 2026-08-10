import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import { useAuthStore } from "../store/authStore";
import type { Event } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);

  const loadEvents = async () => {
    const { data } = await eventsApi.listPublished();
    setEvents(data.events);
  };

  useEffect(() => {
    void (async () => {
      try {
        await loadEvents();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBook = async (id: string) => {
    setBookingId(id);

    try {
      await eventsApi.book(id);
      alert("Booking successful!");
      await loadEvents();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Booking failed"));
    } finally {
      setBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D8B58A] border-t-[#8C5A2B]" />
          <p className="mt-5 text-lg font-semibold text-[#6B4E35]">
            Loading amazing events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE]">

      {/* Hero */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#A67C52] via-[#C9A67B] to-[#E7D8C8] py-24">

        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">

          <h1 className="text-5xl font-black text-white md:text-6xl">
            Discover Amazing Events
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#FFF8F1]">
            Book unforgettable experiences with just one click.
            Premium events, elegant venues, and memories you'll cherish forever.
          </p>

        </div>

      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">

        {events.length === 0 ? (
          <div className="rounded-3xl bg-white p-14 text-center shadow-xl">

            <div className="text-6xl">🎫</div>

            <h2 className="mt-6 text-3xl font-bold text-[#3E3025]">
              No Events Available
            </h2>

            <p className="mt-3 text-[#7A6757]">
              New events will appear here soon.
            </p>

          </div>
        ) : (

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

            {events.map((event) => {

              const seatsLeft =
                event.seatsLeft ?? event.availableSeats ?? 0;

              const full = seatsLeft <= 0;

              const percent =
                event.capacity > 0
                  ? (seatsLeft / event.capacity) * 100
                  : 0;

              return (

                <div
                  key={event.id}
                  className="
                    group
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#E6D7C6]
                    bg-[#FFFCF8]
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >

                  {/* Banner */}

                  <div className="relative h-44 bg-gradient-to-r from-[#A67C52] via-[#C89B6D] to-[#E2C7A7]">

                    <div className="absolute inset-0 bg-black/10" />

                    <div className="absolute bottom-5 left-5">

                      <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#8C5A2B]">
                        Premium Event
                      </span>

                    </div>

                  </div>

                  {/* Content */}

                  <div className="p-7">

                    <h2 className="text-2xl font-bold text-[#3E3025]">
                      {event.title}
                    </h2>

                    <p className="mt-4 line-clamp-3 leading-7 text-[#756251]">
                      {event.description || "No description available."}
                    </p>

                    {/* Badges */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      <span className="rounded-full bg-[#F1E6DA] px-4 py-2 text-sm font-semibold text-[#8C5A2B]">
                        📍 {event.location || "Unknown"}
                      </span>

                      <span className="rounded-full bg-[#F1E6DA] px-4 py-2 text-sm font-semibold text-[#8C5A2B]">
                        📮 {event.postcode || "-"}
                      </span>

                      <span className="rounded-full bg-[#F1E6DA] px-4 py-2 text-sm font-semibold text-[#8C5A2B]">
                        {event.includesFood ? "🍽 Food Included" : "☕ No Food"}
                      </span>

                    </div>

                    {/* Stats */}

                    <div className="mt-8 space-y-4">

                      <div className="flex justify-between">

                        <span className="text-[#6B5A4D]">
                          Capacity
                        </span>

                        <span className="font-bold text-[#3E3025]">
                          {event.capacity}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-[#6B5A4D]">
                          Seats Left
                        </span>

                        <span
                          className={`font-bold ${
                            full
                              ? "text-red-600"
                              : "text-green-700"
                          }`}
                        >
                          {seatsLeft}
                        </span>

                      </div>

                    </div>

                    {/* Progress */}

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E8DDD2]">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8C5A2B] to-[#C89B6D] transition-all duration-700"
                        style={{
                          width: `${percent}%`,
                        }}
                      />

                    </div>

                    {event.mapUrl && (

                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-[#8C5A2B] transition hover:text-[#6D4420]"
                      >
                        📍 Open Map
                      </a>

                    )}

                    <div className="mt-8">

                      {!user ? (

                        <div className="rounded-xl bg-[#F1E6DA] py-4 text-center font-semibold text-[#8C5A2B]">
                          Login to book tickets
                        </div>

                      ) : (

                        <button
                          onClick={() => handleBook(event.id)}
                          disabled={bookingId === event.id || full}
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
                            disabled:opacity-50
                          "
                        >
                          {full
                            ? "Fully Booked"
                            : bookingId === event.id
                            ? "Booking..."
                            : "🎟 Book Ticket"}
                        </button>

                      )}

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