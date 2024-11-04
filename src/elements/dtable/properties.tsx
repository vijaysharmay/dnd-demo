import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import PropertiesElementWrapper from "@/containers/properties-element.wrapper";
import useSchemaStore from "@/store/schema-store";
import { ComponentElementInstance } from "@/types";
import { DTablePropsSchema, DTablePropsZSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { InputFormField, SelectFormField } from "../common/form-fields";
import { handlePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const DTablePropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { schemas } = useSchemaStore();
  const form = useForm<DTablePropsSchema>({
    resolver: zodResolver(DTablePropsZSchema),
    values: elementInstance.props as DTablePropsSchema,
  });

  const onSubmit: SubmitHandler<DTablePropsSchema> = (data) =>
    handlePropertiesFormSubmit(data, elementInstance);

  return (
    <PropertiesElementWrapper>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="dTableId"
            render={({ field }) => (
              <InputFormField
                name="Data Table ID"
                tooltip="A unique identifier which is useful when crafting events"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="dataUrl"
            render={({ field }) => (
              <InputFormField
                name="Data URL"
                tooltip="A GET API Endpoint for rendering the data table"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="responseSchemaMapping"
            render={({ field }) => (
              <SelectFormField
                name="Response Schema"
                tooltip="Schema of the expected response from the data URL"
                field={field}
                variants={Object.keys(schemas)}
              />
            )}
          />

          <FormField
            control={form.control}
            name="dTableHeightInPx"
            render={({ field }) => (
              <InputFormField
                name="Height (in px)"
                tooltip="Height of the horizontal container, in pixels"
                field={field}
              />
            )}
          />

          <Button
            className="w-full mt-4"
            type="submit"
            disabled={!isEmpty(form.formState.errors)}
          >
            Save
          </Button>
        </form>
      </Form>
    </PropertiesElementWrapper>
  );
};
