import { Button, ComponentElements, HContainer, Input } from "@/types";

import { ButtonComponentElement } from "./button";
import { HContainerComponentElement } from "./hcontainer";
import { InputComponentElement } from "./input";

export const libraryElements: ComponentElements = {
  [Input]: InputComponentElement,
  [Button]: ButtonComponentElement,
  [HContainer]: HContainerComponentElement,
  // [DTable]: DTableComponentElement,
};
