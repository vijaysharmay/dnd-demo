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
      width: {
        propertyValue: `300px`,
        showInProperties: true,
        options: null,
      },
      height: {
        propertyValue: `300px`,
        showInProperties: true,
        options: null,
      },
      columns: {
        propertyValue: `3`,
        showInProperties: true,
        options: null,
      },
    },
    events: {},
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
