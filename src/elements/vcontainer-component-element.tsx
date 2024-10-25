import { ComponentElement, VContainer } from "@/types";
import { ButtonIcon } from "@radix-ui/react-icons";
import {
  ButtonDesignerComponent,
  ButtonDragOverlayComponent,
} from "./designer/button-designer-component";
import { randInt } from "@/lib/utils";

export const VContainerComponentElement: ComponentElement = {
  type: VContainer,
  create: (id: string) => ({
    id,
    type: VContainer,
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
  }),
  componentLibraryListItem: {
    icon: <ButtonIcon />,
    label: VContainer,
  },
  designerComponent: ButtonDesignerComponent,
  dragOverlayComponent: ButtonDragOverlayComponent,
  propertiesComponent: () => <div>ButtonComponentElement</div>,
  renderComponent: () => <div>ButtonComponentElement</div>,
};
