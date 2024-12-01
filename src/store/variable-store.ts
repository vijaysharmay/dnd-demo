import { ConcordVariableSchema } from "@/types/api/variable";
import { create } from "zustand";

type ConcordVariableState = {
  concordVariables: ConcordVariableSchema[];
  setConcordVariables: (concordVariables: ConcordVariableSchema[]) => void;
  addConcordVariable: (concordVariable: ConcordVariableSchema) => void;
  getConcordVariableById: (concordVariableId: string) => ConcordVariableSchema | undefined;
  updateConcordVariableById: (concordVariableId: string, updatedConcordVariable: ConcordVariableSchema) => void;
  removeConcordVariableById: (concordVariableId: string) => void;
};

export const useConcordVariableStore = create<ConcordVariableState>((set, get) => ({
  concordVariables: [],
  setConcordVariables: (concordVariables: ConcordVariableSchema[]) => {
    set({ concordVariables });
  },
  addConcordVariable: (concordVariable: ConcordVariableSchema) => {
    const concordVariables = get().concordVariables;
    concordVariables.splice(0, 0, concordVariable);
    set({ concordVariables });
  },
  getConcordVariableById: (concordVariableId: string) => {
    const concordVariables = get().concordVariables;
    const concordVariableIndex = concordVariables.findIndex(
      (x: ConcordVariableSchema) => x.id === concordVariableId
    );
    if (concordVariableIndex !== -1) {
      return concordVariables[concordVariableIndex];
    }
  },
  updateConcordVariableById: (concordVariableId: string, updatedConcordVariable: ConcordVariableSchema) => {
    const concordVariables = get().concordVariables;
    const concordVariableIndex = concordVariables.findIndex(
      (x: ConcordVariableSchema) => x.id === concordVariableId
    );
    if (concordVariableIndex !== -1) {
      concordVariables.splice(concordVariableIndex, 1, updatedConcordVariable);
      set({ concordVariables });
    }
  },
  removeConcordVariableById: (concordVariableId: string) => {
    const concordVariables = get().concordVariables;
    const concordVariableIndex = concordVariables.findIndex(
      (x: ConcordVariableSchema) => x.id === concordVariableId
    );
    if (concordVariableIndex !== -1) {
      concordVariables.splice(concordVariableIndex, 1);
      set({ concordVariables });
    }
  },
}));

export default useConcordVariableStore;
