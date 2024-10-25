import { randInt } from "@/lib/utils";
import { ComponentElement, VContainer } from "@/types";
import { Columns3Icon } from "lucide-react";

import { VContainerDragOverlayComponent } from "./designer/vcontainer-designer-component";
import { VContainerDesignerComponent } from "./designer/vcontainer-designer-component";

export const VContainerComponentElement: ComponentElement = {
  type: VContainer,
  create: (id: string) => ({
    id,
    type: VContainer,
    attributes: {
      vContainerId: {
        propertyValue: `vContainer-${randInt()}`,
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
      rows: {
        propertyValue: `3`,
        showInProperties: true,
        options: null,
      },
    },
    events: {},
  }),
  componentLibraryListItem: {
    icon: <Columns3Icon />,
    label: VContainer,
  },
  designerComponent: VContainerDesignerComponent,
  dragOverlayComponent: VContainerDragOverlayComponent,
  propertiesComponent: () => <div>ButtonComponentElement</div>,
  renderComponent: () => <div>ButtonComponentElement</div>,
};
