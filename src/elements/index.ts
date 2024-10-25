import {
  Button,
  ComponentElements,
  HContainer,
  Input,
  VContainer,
} from "@/types";

import { ButtonComponentElement } from "./button-component-element";
import { InputComponentElement } from "./input-component-element";
import { HContainerComponentElement } from "./hcontainer-component-element";
import { VContainerComponentElement } from "./vcontainer-component-element";

export const libraryElements: ComponentElements = {
  [Input]: InputComponentElement,
  [Button]: ButtonComponentElement,
  [HContainer]: HContainerComponentElement,
  [VContainer]: VContainerComponentElement,
};
