import { useEffect, useState } from "react";
import { eventsApi } from "../api/events";
import type { Booking } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await eventsApi.myBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load bookings"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D8B58A] border-t-[#8C5A2B]" />
          <p className="mt-5 text-lg font-semibold text-[#6B4E35]">
            Loading your tickets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE]">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Hero */}

        <div className="rounded-3xl bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E3C8A8] p-10 text-white shadow-xl">

          <h1 className="text-5xl font-black">
            My Tickets
          </h1>

        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-16 text-center shadow-xl">

            <div className="text-7xl">🎟</div>

            <h2 className="mt-6 text-3xl font-bold text-[#3E3025]">
              No Bookings Yet
            </h2>

            <p className="mt-3 text-[#7A6757]">
              Browse events and reserve your first experience.
            </p>

          </div>
        ) : (

          <div className="mt-10 grid gap-8 lg:grid-cols-2">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="
                  relative
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

                {/* Ticket Header */}

                <div className="bg-gradient-to-r from-[#A67C52] via-[#B98B5F] to-[#E2C8A7] p-8 text-white">

                  <div className="flex items-center justify-between">

                    <div>

                      <div className="text-sm opacity-80">
                        EVENT TICKET
                      </div>

                      <h2 className="mt-2 text-3xl font-black">
                        {booking.event?.title ?? "-"}
                      </h2>

                    </div>

                  </div>

                </div>

                {/* Decorative ticket cutouts */}

                <div className="absolute left-0 top-44 h-8 w-8 -translate-x-1/2 rounded-full bg-[#F8F4EE]" />
                <div className="absolute right-0 top-44 h-8 w-8 translate-x-1/2 rounded-full bg-[#F8F4EE]" />

                {/* Ticket Body */}

                <div className="space-y-6 p-8">

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <div className="text-sm text-[#8A7B6E]">
                        📍 Location
                      </div>

                      <div className="mt-1 font-semibold text-[#3E3025]">
                        {booking.event?.location || "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-[#8A7B6E]">
                        📮 Postcode
                      </div>

                      <div className="mt-1 font-semibold text-[#3E3025]">
                        {booking.event?.postcode || "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-[#8A7B6E]">
                        📅 Event Date
                      </div>

                      <div className="mt-1 font-semibold text-[#3E3025]">
                        {booking.event?.startDate
                          ? new Date(
                              booking.event.startDate
                            ).toLocaleString()
                          : "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-[#8A7B6E]">
                        🎟 Booked On
                      </div>

                      <div className="mt-1 font-semibold text-[#3E3025]">
                        {new Date(
                          booking.createdAt
                        ).toLocaleString()}
                      </div>
                    </div>

                  </div>

                  {booking.event?.mapUrl && (

                    <a
                      href={booking.event.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        inline-flex
                        items-center
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
                      📍 Open Event Location
                    </a>

                  )}

                </div>

                {/* Ticket Footer */}

                <div className="border-t border-dashed border-[#E6D7C6] bg-[#FCFAF8] px-8 py-5">

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-[#8C5A2B]">
                      Booking ID
                    </span>

                    <code className="rounded-lg bg-[#EFE3D5] px-3 py-1 text-sm text-[#5D4635]">
                      {booking.id.slice(0, 8).toUpperCase()}
                    </code>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}