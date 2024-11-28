import { randInt } from "@/lib/utils";
import { ComponentElement, Input as InputType } from "@/types";
import { InputPropsSchema } from "@/types/properties";
import { InputIcon } from "@radix-ui/react-icons";

import { InputDesignerComponent, InputDragOverlayComponent } from "./designer";
import { InputPropertiesComponent } from "./properties";
import { InputRenderComponent } from "./render";

export const InputComponentElement: ComponentElement = {
  type: InputType,
  create: (id: string, customProps?: InputPropsSchema, parentId?: string) => ({
    id,
    type: InputType,
    props: customProps
      ? customProps
      : {
          inputId: `input-${randInt()}`,
          inputLabel: "Input Label",
          placeHolder: "This is a placeholder",
          helperText: "This is a helper text",
          inputType: "text",
          isFormElement: false,
        },
    children: [],
    parentId: parentId ? parentId : null,
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
