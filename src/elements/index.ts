import { Button, ComponentElements, Input } from "@/types";

import { ButtonComponentElement } from "./button-component-element";
import { InputComponentElement } from "./input-component-element";

export const libraryElements: ComponentElements = {
  [Input]: InputComponentElement,
  [Button]: ButtonComponentElement,
};
