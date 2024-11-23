import { ComponentElementInstance } from "@/types";
import { create } from "zustand";

import { isNull } from "lodash";

interface ElementState {
  elements: ComponentElementInstance[];
  activeElementId: string | null;
  activeElement: ComponentElementInstance | null;
  setElements: (elements: ComponentElementInstance[]) => void;
  getElementById: (elementId: string) => ComponentElementInstance | null;
  getElementIndexById: (elementId: string) => number;
  setActiveElement: (element: ComponentElementInstance | null) => void;
  setActiveElementId: (elementId: string | null) => void;
  addElement: (index: number, element: ComponentElementInstance) => void;
  addElementToParent: (
    parentElementId: string,
    index: number,
    element: ComponentElementInstance
  ) => void;
  updateElementInParent: (
    parentElementId: string,
    updatedElement: ComponentElementInstance
  ) => void;
  removeElement: (elementId: string, parentId: string | null) => void;
  updateElement: (elementId: string, element: ComponentElementInstance) => void;
  moveElementV: (elementId: string, fromIndex: number, toIndex: number) => void;
}

const useElementStore = create<ElementState>()((set, get) => ({
  elements: [],
  activeElementId: null,
  activeElement: null,
  setElements: (elements: ComponentElementInstance[]) => {
    set({ elements });
  },
  getElementById: (elementId: string) => {
    const elements = get().elements;
    const element = elements.find(
      (x: ComponentElementInstance) => x.id === elementId
    );
    return element ?? null;
  },
  getElementIndexById: (elementId: string) => {
    const elements = get().elements;
    const elementIndex = elements.findIndex(
      (x: ComponentElementInstance) => x.id === elementId
    );
    return elementIndex;
  },
  setActiveElement: (element: ComponentElementInstance | null) => {
    set({ activeElement: element });
  },
  setActiveElementId: (elementId: string | null) => {
    set({ activeElementId: elementId });
  },
  addElement: (index: number, element: ComponentElementInstance) => {
    const elements = get().elements;
    elements.splice(index, 0, element);
    set({ elements });
  },
  addElementToParent: (
    parentElementId: string,
    index: number,
    element: ComponentElementInstance
  ) => {
    const elements = get().elements;
    const parentElementIndex = elements.findIndex(
      (x: ComponentElementInstance) => x.id === parentElementId
    );
    if (parentElementIndex !== -1) {
      const parentElement = elements[parentElementIndex];
      // needs a revisit
      parentElement.children.splice(index, 1, element);
      elements.splice(parentElementIndex, 1, parentElement);
      set({ elements });
    }
  },
  updateElementInParent: (
    parentElementId: string,
    updatedElement: ComponentElementInstance
  ) => {
    const elements = get().elements;
    const parentElementIndex = elements.findIndex(
      (x: ComponentElementInstance) => x.id === parentElementId
    );
    if (parentElementIndex !== -1) {
      const parentElement = elements[parentElementIndex];
      const updatedElementIndex = parentElement.children.findIndex(
        (child: ComponentElementInstance | null) => {
          if (isNull(child)) return -1;
          return child.id === updatedElement.id;
        }
      );
      if (updatedElementIndex !== -1) {
        parentElement.children.splice(updatedElementIndex, 1, updatedElement);
      }
      elements.splice(parentElementIndex, 1, parentElement);
      set({ elements });
    }
  },
  removeElement: (elementId: string, parentId: string | null) => {
    const elements = get().elements;

    if (parentId !== null) {
      const parentElement = get().getElementById(parentId);
      if (parentElement !== null) {
        const elementIndex = parentElement.children.findIndex(
          (x: ComponentElementInstance | null) => x && x.id === elementId
        );
        if (elementIndex !== -1) {
          parentElement.children.splice(elementIndex, 1, null);
          get().updateElement(parentId, parentElement);
        }
      }
    }

    const elementIndex = elements.findIndex(
      (x: ComponentElementInstance) => x.id === elementId
    );
    if (elementIndex !== -1) {
      elements.splice(elementIndex, 1);
      set({ elements });
    }
  },
  updateElement: (elementId: string, element: ComponentElementInstance) => {
    const elements = get().elements;
    const elementIndex = elements.findIndex(
      (x: ComponentElementInstance) => x.id === elementId
    );
    if (elementIndex !== -1) {
      elements.splice(elementIndex, 1, element);
      set({ elements });
    }
  },
  moveElementV: (elementId: string, fromIndex: number, toIndex: number) => {
    const elements = get().elements;
    const element = elements.find(
      (x: ComponentElementInstance) => x.id === elementId
    );
    if (element) {
      elements.splice(fromIndex, 1);
      elements.splice(toIndex, 0, element);
      set({ elements });
    }
  },
}));

export default useElementStore;
