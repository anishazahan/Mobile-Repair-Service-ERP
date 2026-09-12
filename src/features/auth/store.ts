import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StaffUser } from "@/types";

interface AuthState {
  user: StaffUser | null;
  token: string | null;
  isAuthenticated: boolean;
  logIn: (user: StaffUser, token: string) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      logIn: (user, token) => set({ user, token, isAuthenticated: true }),
      logOut: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "gadgetfix-auth-session" },
  ),
);
