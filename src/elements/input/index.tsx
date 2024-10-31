import { ComponentElement, Input as InputType } from "@/types";
import { InputPropsZSchema } from "@/types/properties";
import { generateMock } from "@anatine/zod-mock";
import { InputIcon } from "@radix-ui/react-icons";
import { InputDesignerComponent, InputDragOverlayComponent } from "./designer";
import { InputPropertiesComponent } from "./properties";
import { InputRenderComponent } from "./render";

export const InputComponentElement: ComponentElement = {
  type: InputType,
  create: (id: string) => ({
    id,
    type: InputType,
    props: generateMock(InputPropsZSchema),
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <InputIcon />,
    label: InputType,
  },
  designerComponent: InputDesignerComponent,
  dragOverlayComponent: InputDragOverlayComponent,
  propertiesComponent: InputPropertiesComponent,
  renderComponent: InputRenderComponent,
};
