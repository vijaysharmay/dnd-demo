import { Reviewer, VersionSchema } from "@/types/api/page";
import { create } from "zustand";

type VersionState = {
  currentVersion: VersionSchema | null;
  currentVersionReviewers: Reviewer[];
  setCurrentVersion: (currentVersion: VersionSchema | null) => void;
  setCurrentVersionReviewers: (currentVersionReviewers: Reviewer[]) => void;
};

export const useVersionStore = create<VersionState>((set) => ({
  currentVersion: null,
  currentVersionReviewers: [],
  setCurrentVersion: (currentVersion: VersionSchema | null) => {
    set({ currentVersion });
  },
  setCurrentVersionReviewers: (currentVersionReviewers: Reviewer[]) => {
    set({ currentVersionReviewers });
  },
}));

export default useVersionStore;
