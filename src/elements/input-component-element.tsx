import { ComponentElement, Input as InputType } from "@/types";
import { InputIcon } from "@radix-ui/react-icons";
import InputDesignerComponent from "./designer/input-designer-component";

export const InputComponentElement: ComponentElement = {
  type: InputType,
  create: (id: string) => ({
    id,
    type: InputType,
    attributes: {
      id,
      inputType: "text",
      label: "Default Label",
      helperText: "Default Helper Text",
      placeHolder: "Default Placeholder",
    },
    events: {},
  }),
  componentLibraryListItem: {
    icon: <InputIcon />,
    label: InputType,
  },
  designerComponent: InputDesignerComponent,
  propertiesComponent: () => <div>InputComponentElement</div>,
  renderComponent: () => <div>InputComponentElement</div>,
};
