import { Barchart, ComponentElement } from "@/types";
import { BarchartPropsSchema } from "@/types/properties";

import { RandInt } from "@/lib/utils";
import { BarChart } from "lucide-react";
import {
  BarchartDesignerComponent,
  BarchartDragOverlayComponent,
} from "./designer";
import { BarchartPropertiesComponent } from "./properties";
import { BarchartRenderComponent } from "./render";

export const BarchartComponentElement: ComponentElement = {
  type: Barchart,
  create: (id: string, customProps?: BarchartPropsSchema) => ({
    id,
    type: Barchart,
    props: customProps
      ? customProps
      : {
          barchartId: `barchart-${RandInt()}`,
          barchartTitle: "Sample",
          barchartDescription: "This is a sample barchart",
          accord: null,
          accordId: null,
          dataKey: "",
          barchartInsightTitle: "Insight",
          barchartInsightDescription: "This is a sample insight description",
          barchartHeightInPx: "200px",
        },
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <BarChart />,
    label: Barchart,
  },
  designerComponent: BarchartDesignerComponent,
  dragOverlayComponent: BarchartDragOverlayComponent,
  propertiesComponent: BarchartPropertiesComponent,
  renderComponent: BarchartRenderComponent,
};
