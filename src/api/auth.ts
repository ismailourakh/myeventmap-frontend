import { api } from "./client";
import type { AuthResponse, User } from "../types";

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", payload),

  login: (payload: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", payload),

  me: () => api.get<{ user: User }>("/auth/me"),
};