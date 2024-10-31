import { ComponentElement, HContainer } from "@/types";
import { InputPropsZSchema } from "@/types/properties";
import { generateMock } from "@anatine/zod-mock";
import { Columns3Icon } from "lucide-react";
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
    props: generateMock(InputPropsZSchema),
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <Columns3Icon />,
    label: HContainer,
  },
  designerComponent: HContainerDesignerComponent,
  dragOverlayComponent: HContainerDragOverlayComponent,
  propertiesComponent: HContainerPropertiesComponent,
  renderComponent: HContainerRenderComponent,
};
