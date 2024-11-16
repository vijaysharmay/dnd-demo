import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (accessToken: string) => {
    sessionStorage.setItem("accessToken", accessToken);
    set({ isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem("accessToken");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
