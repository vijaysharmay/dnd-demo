import { RandInt } from "@/lib/utils";
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
    props: {
      dTableId: `dTable-${RandInt()}`,
      accordId: null,
      accord: null,
      dTableHeightInPx: "200px",
    },
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
