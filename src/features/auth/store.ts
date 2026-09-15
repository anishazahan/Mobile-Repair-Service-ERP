import type { StaffUser } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: StaffUser | null;
  token: string | null;
  isAuthenticated: boolean;
  logIn: (user: StaffUser, token: string) => void;
  logOut: () => void;

  updateUser: (user: StaffUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      logIn: (user, token) => set({ user, token, isAuthenticated: true }),
      logOut: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    { name: "gadgetfix-auth-session" },
  ),
);
