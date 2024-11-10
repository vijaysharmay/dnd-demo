import { randInt } from "@/lib/utils";
import { ComponentElement, ComponentElementInstance, Form } from "@/types";
import { CustomPropsSchema, InputPropsSchema } from "@/types/properties";
import { JSONSchema4TypeName, JSONSchema7, JSONSchema7Definition } from "json-schema";
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

function initFormChildren(
  schemaName: string
): (ComponentElementInstance | null)[] {
  const schemaStore = localStorage["schemaStore"];
  if (isNull(schemaStore)) return [];
  const schema: JSONSchema7 =
    JSON.parse(schemaStore).state.schemas[schemaName].schema;

  if (isNull(schema.properties)) return [];

  const children: (ComponentElementInstance | null)[] = keys(
    schema.properties
  ).map((prop: string) => {
    if (schema.properties) {
      const propObj: JSONSchema7Definition = schema.properties[prop];
      const inputInstanceProps: InputPropsSchema = {
        inputId: `input-${randInt()}`,
        inputLabel: capitalize(prop),
        placeHolder: capitalize(prop),
        helperText: capitalize(prop),
        inputType: "text",
        isFormElement: true,
        schemaPropertyMapping: {
          name: prop,
          type: (propObj as JSONSchema7).type as JSONSchema4TypeName,
        },
      };
      return libraryElements.Input.create(
        v4(),
        inputInstanceProps as CustomPropsSchema
      );
    } else {
      return null;
    }
  });
  return children;
}
