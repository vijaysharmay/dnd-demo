import { PageSchema } from "@/api";
import { create } from "zustand";

type PageState = {
  currentPage: PageSchema | null;
  setCurrentPage: (currentPage: PageSchema | null) => void;
};

export const usePageStore = create<PageState>((set) => ({
  currentPage: null,
  setCurrentPage: (currentPage: PageSchema | null) => {
    set({ currentPage });
  },
}));

export default usePageStore;
