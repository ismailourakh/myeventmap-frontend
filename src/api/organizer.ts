import { api } from "./client";
import type { OrganizerApplication } from "../types";

export const organizerApi = {
  apply: (payload: { message?: string }) =>
    api.post<{ application: OrganizerApplication }>("/organizer-applications", payload),

  getMine: () => api.get<{ application: OrganizerApplication | null }>("/organizer-applications/me"),

  listApplications: (status?: "PENDING" | "APPROVED" | "REJECTED") =>
    api.get<{ applications: OrganizerApplication[] }>("/admin/organizer-applications", {
      params: status ? { status } : undefined,
    }),

  approve: (id: string) => api.post(`/admin/organizer-applications/${id}/approve`),

  reject: (id: string) => api.post(`/admin/organizer-applications/${id}/reject`),
};