import { RandInt } from "@/lib/utils";
import { ComponentElement, HContainer } from "@/types";
import { LayoutTemplate } from "lucide-react";

import {
  HContainerDesignerComponent,
  HContainerDragOverlayComponent,
} from "./designer";
import { HContainerPropertiesComponent } from "./properties";
import { HContainerRenderComponent } from "./render";

export const HContainerComponentElement: ComponentElement = {
  type: HContainer,
  create: (id: string) => ({
    id,
    type: HContainer,
    props: {
      hContainerId: `hContainer-${RandInt()}`,
      hContainerHeightInPx: "100px",
      hContainerColumns: "One",
    },
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <LayoutTemplate />,
    label: HContainer,
  },
  designerComponent: HContainerDesignerComponent,
  dragOverlayComponent: HContainerDragOverlayComponent,
  propertiesComponent: HContainerPropertiesComponent,
  renderComponent: HContainerRenderComponent,
};
