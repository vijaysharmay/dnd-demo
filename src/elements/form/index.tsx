import { randInt } from "@/lib/utils";
import { ComponentElement, Form } from "@/types";
import { NotepadText } from "lucide-react";

import { CustomPropsSchema } from "@/types/properties";
import { FormDesignerComponent, FormDragOverlayComponent } from "./designer";
import { FormPropertiesComponent } from "./properties";
import { FormRenderComponent } from "./render";

export const FormComponentElement: ComponentElement = {
  type: Form,
  create: (id: string, customProps?: CustomPropsSchema, parentId?: string) => ({
    id,
    type: Form,
    props: customProps
      ? customProps
      : {
          formId: `form-${randInt()}`,
          accordId: null,
          accord: null,
          formHeightInPx: "200px",
        },
    children: [], //initFormChildren("JSONPlaceholderPosts")
    parentId: parentId ? parentId : null,
  }),
  componentLibraryListItem: {
    icon: <NotepadText />,
    label: Form,
  },
  designerComponent: FormDesignerComponent,
  dragOverlayComponent: FormDragOverlayComponent,
  propertiesComponent: FormPropertiesComponent,
  renderComponent: FormRenderComponent,
};
