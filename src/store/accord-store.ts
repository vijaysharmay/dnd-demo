import { AccordSchema } from "@/types/api/accord";
import { create } from "zustand";

type AccordState = {
  accords: AccordSchema[];
  setAccords: (accords: AccordSchema[]) => void;
  addAccord: (accord: AccordSchema) => void;
  getAccordById: (accordId: string) => AccordSchema | undefined;
  updateAccordById: (accordId: string, updatedAccord: AccordSchema) => void;
  removeAccordById: (accordId: string) => void;
};

export const useAccordStore = create<AccordState>((set, get) => ({
  accords: [],
  setAccords: (accords: AccordSchema[]) => {
    set({ accords });
  },
  addAccord: (accord: AccordSchema) => {
    const accords = get().accords;
    accords.splice(0, 0, accord);
    set({ accords });
  },
  getAccordById: (accordId: string) => {
    const accords = get().accords;
    const accordIndex = accords.findIndex(
      (x: AccordSchema) => x.id === accordId
    );
    if (accordIndex !== -1) {
      return accords[accordIndex];
    }
  },
  updateAccordById: (accordId: string, updatedAccord: AccordSchema) => {
    const accords = get().accords;
    const accordIndex = accords.findIndex(
      (x: AccordSchema) => x.id === accordId
    );
    if (accordIndex !== -1) {
      accords.splice(accordIndex, 1, updatedAccord);
      set({ accords });
    }
  },
  removeAccordById: (accordId: string) => {
    const accords = get().accords;
    const accordIndex = accords.findIndex(
      (x: AccordSchema) => x.id === accordId
    );
    if (accordIndex !== -1) {
      accords.splice(accordIndex, 1);
      set({ accords });
    }
  },
}));

export default useAccordStore;
