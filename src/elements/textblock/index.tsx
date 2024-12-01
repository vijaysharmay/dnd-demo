import { RandInt } from "@/lib/utils";
import { ComponentElement, TextBlock } from "@/types";
import { TextBlockPropsSchema } from "@/types/properties";

import { Heading } from "lucide-react";
import {
  TextBlockDesignerComponent,
  TextBlockDragOverlayComponent,
} from "./designer";
import { TextBlockPropertiesComponent } from "./properties";
import { TextBlockRenderComponent } from "./render";

export const TextBlockComponentElement: ComponentElement = {
  type: TextBlock,
  create: (id: string, customProps?: TextBlockPropsSchema) => ({
    id,
    type: TextBlock,
    props: customProps
      ? customProps
      : {
          textBlockId: `textBlock-${RandInt()}`,
          textBlockText: "TextBlock",
          textBlockType: "H6",
          textBlockStyle: "normal",
          textBlockOrientation: "left",
          isFormElement: false,
        },
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <Heading />,
    label: "TextBlock",
  },
  designerComponent: TextBlockDesignerComponent,
  dragOverlayComponent: TextBlockDragOverlayComponent,
  propertiesComponent: TextBlockPropertiesComponent,
  renderComponent: TextBlockRenderComponent,
  showInDesignerPanel: true,
};
