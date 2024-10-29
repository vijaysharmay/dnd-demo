import { Button, ComponentElements, HContainer, Input, DTable } from "@/types";

import { ButtonComponentElement } from "./button-component-element";
import { InputComponentElement } from "./input-component-element";
import { HContainerComponentElement } from "./hcontainer-component-element";
import { DTableComponentElement } from "./dtable-component-element";

export const libraryElements: ComponentElements = {
  [Input]: InputComponentElement,
  [Button]: ButtonComponentElement,
  [HContainer]: HContainerComponentElement,
  [DTable]: DTableComponentElement,
};
