import { randInt } from "@/lib/utils";
import { Button, ComponentElement } from "@/types";
import { ButtonPropsSchema } from "@/types/properties";
import { faker } from "@faker-js/faker";
import { ButtonIcon } from "@radix-ui/react-icons";

import { ButtonDesignerComponent, ButtonDragOverlayComponent } from "./designer";
import { ButtonPropertiesComponent } from "./properties";
import { ButtonRenderComponent } from "./render";

export const ButtonComponentElement: ComponentElement = {
  type: Button,
  create: (id: string, customProps?: ButtonPropsSchema) => ({
    id,
    type: Button,
    props: customProps
      ? customProps
      : {
          buttonId: `button-${randInt()}`,
          buttonText: faker.string.alpha({ length: { min: 5, max: 10 } }),
          buttonVariant: "default",
          buttonType: "button",
          onClickHandler: "Do Nothing",
          isFormElement: false,
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
