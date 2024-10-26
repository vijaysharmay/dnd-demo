import { randInt } from "@/lib/utils";
import { ComponentElement, HContainer } from "@/types";
import { Columns3Icon } from "lucide-react";

import {
  HContainerDesignerComponent,
  HContainerDragOverlayComponent,
} from "./designer/hcontainer-designer-component";

export const HContainerComponentElement: ComponentElement = {
  type: HContainer,
  create: (id: string) => ({
    id,
    type: HContainer,
    attributes: {
      hContainerId: {
        propertyValue: `hcontainer-${randInt()}`,
        showInProperties: true,
        options: null,
      },
      height: {
        propertyValue: "100",
        showInProperties: true,
        options: null,
      },
      columns: {
        propertyValue: "1",
        showInProperties: true,
        options: ["1", "2", "3"],
      },
    },
    events: {},
    children: [],
  }),
  componentLibraryListItem: {
    icon: <Columns3Icon />,
    label: HContainer,
  },
  designerComponent: HContainerDesignerComponent,
  dragOverlayComponent: HContainerDragOverlayComponent,
  propertiesComponent: () => <div>ButtonComponentElement</div>,
  renderComponent: () => <div>ButtonComponentElement</div>,
};
