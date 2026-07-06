export type UserRole = "PARTICIPANT" | "ORGANIZER" | "ADMIN";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OrganizerApplication {
  id: string;
  userId: string;
  message?: string | null;
  status: ApplicationStatus;
  approvedByAdminId?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  approvedByAdmin?: User;
}

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  postcode?: string | null;
  mapUrl?: string | null;
  includesFood: boolean;
  startDate: string;
  endDate: string;
  status: EventStatus;
  capacity: number;
  availableSeats: number;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  organizer?: Pick<User, "id" | "name" | "email">;
  bookingsCount?: number;
  seatsLeft?: number;
}

export interface Booking {
  id: string;
  createdAt: string;
  event?: {
    id: string;
    title: string;
    location?: string | null;
    postcode?: string | null;
    mapUrl?: string | null;
    startDate: string;
    endDate: string;
    status: EventStatus;
    capacity: number;
    availableSeats: number;
  };
  user?: Pick<User, "id" | "name" | "email">;
}

export interface EventAttendee {
  id: string; // booking id
  createdAt: string;
  user: Pick<User, "id" | "name" | "email">;
}