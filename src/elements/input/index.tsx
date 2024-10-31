import { randInt } from "@/lib/utils";
import { ComponentElement, Input as InputType } from "@/types";
import { faker } from "@faker-js/faker";
import { InputIcon } from "@radix-ui/react-icons";
import { InputDesignerComponent, InputDragOverlayComponent } from "./designer";
import { InputPropertiesComponent } from "./properties";
import { InputRenderComponent } from "./render";

export const InputComponentElement: ComponentElement = {
  type: InputType,
  create: (id: string) => ({
    id,
    type: InputType,
    props: {
      inputId: `input-${randInt()}`,
      inputLabel: faker.string.alpha({ length: { min: 5, max: 10 } }),
      placeHolder: faker.string.alpha({ length: { min: 5, max: 10 } }),
      helperText: faker.string.alpha({ length: { min: 5, max: 10 } }),
      inputType: "text",
    },
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
