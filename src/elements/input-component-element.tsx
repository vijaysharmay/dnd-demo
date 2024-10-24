import { ComponentElement, Input as InputType } from "@/types";
import { InputIcon } from "@radix-ui/react-icons";
import {
  InputDesignerComponent,
  InputDragOverlayComponent,
} from "./designer/input-designer-component";
import { randInt } from "@/lib/utils";

export const InputComponentElement: ComponentElement = {
  type: InputType,
  create: (id: string) => ({
    id,
    type: InputType,
    attributes: {
      inputId: {
        propertyValue: `input-${randInt()}`,
        showInProperties: false,
        options: null,
      },
      inputType: {
        propertyValue: "text",
        showInProperties: true,
        options: ["text", "password"],
      },
      label: {
        propertyValue: "Default Label",
        showInProperties: true,
        options: null,
      },
      helperText: {
        propertyValue: "Default Helper Text",
        showInProperties: true,
        options: null,
      },
      placeHolder: {
        propertyValue: "Default Placeholder",
        showInProperties: true,
        options: null,
      },
    },
    events: {},
  }),
  componentLibraryListItem: {
    icon: <InputIcon />,
    label: InputType,
  },
  designerComponent: InputDesignerComponent,
  dragOverlayComponent: InputDragOverlayComponent,
  propertiesComponent: () => <div>InputComponentElement</div>,
  renderComponent: () => <div>InputComponentElement</div>,
};
