import { api } from "./client";
import type { Booking, Event } from "../types";

export const eventsApi = {
  listPublished: (params?: { from?: string; to?: string; q?: string }) =>
    api.get<{ events: Event[] }>("/events", { params }),

  getPublished: (id: string) => api.get<{ event: Event }>(`/events/${id}`),

  listMine: () => api.get<{ events: Event[] }>("/events/mine"),

  getMineById: (id: string) => api.get<{ event: Event }>(`/events/mine/${id}`),

  create: (payload: Partial<Event>) => api.post<{ event: Event }>("/events", payload),

  update: (id: string, payload: Partial<Event>) =>
    api.put<{ event: Event }>(`/events/${id}`, payload),

  remove: (id: string) => api.delete(`/events/${id}`),

  book: (id: string) => api.post(`/events/${id}/book`),

  myBookings: () => api.get<{ bookings: Booking[] }>("/me/bookings"),

  getAttendees: (id: string) => api.get<{ attendees: any[] }>(`/events/${id}/attendees`),
};