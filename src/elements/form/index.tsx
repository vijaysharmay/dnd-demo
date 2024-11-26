import { initFormChildren, randInt } from "@/lib/utils";
import { ComponentElement, Form } from "@/types";
import { NotepadText } from "lucide-react";

import { FormDesignerComponent, FormDragOverlayComponent } from "./designer";
import { FormPropertiesComponent } from "./properties";
import { FormRenderComponent } from "./render";

export const FormComponentElement: ComponentElement = {
  type: Form,
  create: (id: string) => ({
    id,
    type: Form,
    props: {
      formId: `form-${randInt()}`,
      accord: null,
      formHeightInPx: "200px",
    },
    children: initFormChildren("JSONPlaceholderPosts"),
    parentId: null,
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
