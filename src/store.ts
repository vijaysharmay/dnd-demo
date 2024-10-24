import { create } from "zustand";
import { ComponentElementInstance } from "./types";
import { devtools, persist } from "zustand/middleware";

interface ElementState {
  elements: ComponentElementInstance[];
  activeElementId: string | null;
  getElementById: (elementId: string) => ComponentElementInstance | undefined;
  setActiveElement: (elementId: string) => void;
  addElement: (index: number, element: ComponentElementInstance) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, element: ComponentElementInstance) => void;
}

const useElementStore = create<ElementState>()(
  devtools(
    persist(
      (set, get) => ({
        elements: [],
        activeElementId: null,
        getElementById: (elementId: string) => {
          const elements = get().elements;
          const element = elements.find(
            (x: ComponentElementInstance) => x.id === elementId
          );
          return element;
        },
        setActiveElement: (elementId: string) => {
          const elements = get().elements;
          const activeElement = elements.find(
            (x: ComponentElementInstance) => x.id === elementId
          );
          if (activeElement) {
            set({ activeElementId: elementId });
          }
        },
        addElement: (index: number, element: ComponentElementInstance) => {
          const elements = get().elements;
          elements.splice(index, 0, element);
          set({ elements });
        },
        removeElement: (elementId: string) => {
          const elements = get().elements;
          const elementIndex = elements.findIndex(
            (x: ComponentElementInstance) => x.id === elementId
          );
          if (elementIndex !== -1) {
            elements.splice(elementIndex, 1);
            set({ elements });
          }
        },
        updateElement: (
          elementId: string,
          element: ComponentElementInstance
        ) => {
          const elements = get().elements;
          const elementIndex = elements.findIndex(
            (x: ComponentElementInstance) => x.id === elementId
          );
          if (elementIndex !== -1) {
            elements.splice(elementIndex, 1, element);
            set({ elements });
          }
        },
      }),
      { name: "elementStore" }
    )
  )
);

export default useElementStore;
