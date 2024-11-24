import { VersionSchema } from "@/types/api/page";
import { create } from "zustand";

type VersionState = {
  currentVersion: VersionSchema | null;
  setCurrentVersion: (currentVersion: VersionSchema | null) => void;
};

export const useVersionStore = create<VersionState>((set) => ({
  currentVersion: null,
  setCurrentVersion: (currentVersion: VersionSchema | null) => {
    set({ currentVersion });
  },
}));

export default useVersionStore;
