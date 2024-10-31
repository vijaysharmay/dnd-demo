import { randInt } from "@/lib/utils";
import { ComponentElement, DTable } from "@/types";
import { Table } from "lucide-react";

import {
  DTableDesignerComponent,
  DTableDragOverlayComponent,
} from "./designer";
import { DTablePropertiesComponent } from "./properties";
import { DTableRenderComponent } from "./render";

export const DTableComponentElement: ComponentElement = {
  type: DTable,
  create: (id: string) => ({
    id,
    type: DTable,
    attributes: {
      DTableId: {
        propertyValue: `dTable-${randInt()}`,
        showInProperties: true,
        options: null,
      },
      data: {
        propertyValue: "",
        showInProperties: true,
        options: null,
      },
    },
    events: {},
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <Table />,
    label: DTable,
  },
  designerComponent: DTableDesignerComponent,
  dragOverlayComponent: DTableDragOverlayComponent,
  propertiesComponent: DTablePropertiesComponent,
  renderComponent: DTableRenderComponent,
};
