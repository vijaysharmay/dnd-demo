import {
  Barchart,
  Button,
  ComponentElementRegister,
  DTable,
  Form,
  HContainer,
  Input,
  TextBlock,
} from "@/types";

import { BarchartComponentElement } from "./barchart";
import { ButtonComponentElement } from "./button";
import { DTableComponentElement } from "./dtable";
import { FormComponentElement } from "./form";
import { HContainerComponentElement } from "./hcontainer";
import { InputComponentElement } from "./input";
import { TextBlockComponentElement } from "./textblock";

export const LibraryElementsRegister: ComponentElementRegister = {
  [TextBlock]: TextBlockComponentElement,
  [Input]: InputComponentElement,
  [Button]: ButtonComponentElement,
  [HContainer]: HContainerComponentElement,
  [DTable]: DTableComponentElement,
  [Form]: FormComponentElement,
  [Barchart]: BarchartComponentElement,
};
