import { Button, ComponentElements, DTable, HContainer, Input } from "@/types";

import { ButtonComponentElement } from "./button";
import { DTableComponentElement } from "./dtable";
import { HContainerComponentElement } from "./hcontainer";
import { InputComponentElement } from "./input";

export const libraryElements: ComponentElements = {
  [Input]: InputComponentElement,
  [Button]: ButtonComponentElement,
  [HContainer]: HContainerComponentElement,
  [DTable]: DTableComponentElement,
};
