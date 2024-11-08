import { randInt } from "@/lib/utils";
import { ComponentElement, Form } from "@/types";
import { CustomPropsSchema, InputPropsSchema } from "@/types/properties";
import { capitalize, isNull, keys } from "lodash";
import { NotepadText } from "lucide-react";
import { v4 } from "uuid";

import { libraryElements } from "..";
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
      onSubmitUrl: "https://jsonplaceholder.typicode.com/posts",
      responseSchemaMapping: "JSONPlaceholderPosts",
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

function initFormChildren(schemaName: string) {
  const schemaStore = localStorage["schemaStore"];
  if (isNull(schemaStore)) return [];
  const schema = JSON.parse(
    JSON.parse(schemaStore).state.schemas[schemaName].schema
  );

  return keys(schema.items.properties).map((prop: string) => {
    const inputInstanceProps: InputPropsSchema = {
      inputId: `input-${randInt()}`,
      inputLabel: capitalize(prop),
      placeHolder: capitalize(prop),
      helperText: capitalize(prop),
      inputType: "text",
      isFormElement: true,
    };
    return libraryElements.Input.create(
      v4(),
      inputInstanceProps as CustomPropsSchema
    );
  });
}
