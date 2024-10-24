import { Button, ComponentElement } from "@/types";
import { ButtonIcon } from "@radix-ui/react-icons";
import ButtonDesignerComponent from "./designer/button-designer-component";

export const ButtonComponentElement: ComponentElement = {
  type: Button,
  create: (id: string) => ({
    id,
    type: Button,
    attributes: {
      buttonText: "Default Button",
      variant: "line",
    },
    events: {
      onClickHandler: () => {},
    },
  }),
  componentLibraryListItem: {
    icon: <ButtonIcon />,
    label: Button,
  },
  designerComponent: ButtonDesignerComponent,
  propertiesComponent: () => <div>ButtonComponentElement</div>,
  renderComponent: () => <div>ButtonComponentElement</div>,
};
