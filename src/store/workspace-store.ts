import { create } from "zustand";

type WorkspaceState = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<WorkspaceState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
