import { randInt } from "@/lib/utils";
import { Button, ComponentElement } from "@/types";
import { faker } from "@faker-js/faker";
import { ButtonIcon } from "@radix-ui/react-icons";
import {
  ButtonDesignerComponent,
  ButtonDragOverlayComponent,
} from "./designer";
import { ButtonPropertiesComponent } from "./properties";
import { ButtonRenderComponent } from "./render";

export const ButtonComponentElement: ComponentElement = {
  type: Button,
  create: (id: string) => ({
    id,
    type: Button,
    props: {
      buttonId: `button-${randInt()}`,
      buttonText: faker.string.alpha({ length: { min: 5, max: 10 } }),
      buttonVariant: "default",
      onClickHandler: "Do Nothing",
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
  propertiesComponent: ButtonPropertiesComponent,
  renderComponent: ButtonRenderComponent,
};
