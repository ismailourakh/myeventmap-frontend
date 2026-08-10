import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Event, EventAttendee } from "../types";
import { getErrorMessage } from "../lib/httpError";

export function EventAttendeesPage() {
  const { id } = useParams();

  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    void (async () => {
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          api.get<{ event: Event }>(`/events/mine/${id}`),
          api.get<{ attendees: EventAttendee[] }>(
            `/events/${id}/attendees`
          ),
        ]);

        setEvent(eventRes.data.event);
        setAttendees(attendeesRes.data.attendees);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load attendees"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D8B58A] border-t-[#8C5A2B]" />
          <p className="mt-5 text-lg font-semibold text-[#6B4E35]">
            Loading attendees...
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

          <h1 className="text-5xl font-black">
            Event Attendees
          </h1>

          <p className="mt-4 text-xl text-[#FFF8EF]">
            {event?.title ?? "Your Event"}
          </p>

        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <div className="text-4xl">👥</div>

            <div className="mt-4 text-4xl font-black text-[#8C5A2B]">
              {attendees.length}
            </div>

            <div className="mt-2 text-[#7A6757]">
              Registered Attendees
            </div>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <div className="text-4xl">🎟</div>

            <div className="mt-4 text-4xl font-black text-[#8C5A2B]">
              {event?.capacity ?? "-"}
            </div>

            <div className="mt-2 text-[#7A6757]">
              Capacity
            </div>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <div className="text-4xl">💺</div>

            <div className="mt-4 text-4xl font-black text-[#8C5A2B]">
              {event?.seatsLeft ??
                event?.availableSeats ??
                "-"}
            </div>

            <div className="mt-2 text-[#7A6757]">
              Seats Left
            </div>

          </div>

        </div>

        {attendees.length === 0 ? (

          <div className="mt-10 rounded-3xl bg-white p-16 text-center shadow-xl">

            <div className="text-7xl">
              🎫
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#3E3025]">
              No Attendees Yet
            </h2>

            <p className="mt-3 text-[#7A6757]">
              Once people book your event they will appear here.
            </p>

          </div>

        ) : (

          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl">

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-[#F4E8DB]">

                  <tr>

                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#6B4E35]">
                      Attendee
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#6B4E35]">
                      Email
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-[#6B4E35]">
                      Booking Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendees.map((attendee) => (

                    <tr
                      key={attendee.id}
                      className="border-t border-[#EFE3D5] transition hover:bg-[#FCFAF8]"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#A67C52] to-[#8C5A2B] font-bold text-white">

                            {(attendee.user?.name ?? "?")
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <div className="font-bold text-[#3E3025]">
                              {attendee.user?.name}
                            </div>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-[#6B5A4D]">
                        {attendee.user?.email}
                      </td>

                      <td className="px-6 py-5 text-[#6B5A4D]">
                        {new Date(
                          attendee.createdAt
                        ).toLocaleString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}