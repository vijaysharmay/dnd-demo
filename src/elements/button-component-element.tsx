import { Button, ComponentElement } from "@/types";
import { ButtonIcon } from "@radix-ui/react-icons";
import {
  ButtonDesignerComponent,
  ButtonDragOverlayComponent,
} from "./designer/button-designer-component";
import { randInt } from "@/lib/utils";

export const ButtonComponentElement: ComponentElement = {
  type: Button,
  create: (id: string) => ({
    id,
    type: Button,
    attributes: {
      buttonId: {
        propertyValue: `button-${randInt()}`,
        showInProperties: true,
        options: null,
      },
      buttonText: {
        propertyValue: Math.random().toString(36).slice(2, 7),
        showInProperties: true,
        options: null,
      },
      variant: {
        propertyValue: "default",
        options: ["default", "outline"],
        showInProperties: true,
      },
    },
    events: {
      onClickHandler: () => {},
    },
    children: [],
    parentId: null,
  }),
  componentLibraryListItem: {
    icon: <ButtonIcon />,
    label: Button,
  },
  designerComponent: ButtonDesignerComponent,
  dragOverlayComponent: ButtonDragOverlayComponent,
  propertiesComponent: () => <div>ButtonComponentElement</div>,
  renderComponent: () => <div>ButtonComponentElement</div>,
};
