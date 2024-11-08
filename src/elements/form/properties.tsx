import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import PropertiesElementWrapper from "@/containers/properties-element.wrapper";
import useSchemaStore from "@/store/schema-store";
import { ComponentElementInstance } from "@/types";
import { FormPropsSchema, FormPropsZSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { InputFormField, SelectFormField } from "../common/form-fields";
import { handlePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const FormPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { schemas } = useSchemaStore();
  const form = useForm<FormPropsSchema>({
    resolver: zodResolver(FormPropsZSchema),
    values: elementInstance.props as FormPropsSchema,
  });

  const onSubmit: SubmitHandler<FormPropsSchema> = (data) =>
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
            name="formId"
            render={({ field }) => (
              <InputFormField
                name="Form ID"
                tooltip="A unique identifier which is useful when crafting events"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="onSubmitUrl"
            render={({ field }) => (
              <InputFormField
                name="On Submit URL"
                tooltip="A POST API Endpoint for submitting the form"
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
                tooltip="Schema of the expected request for the URL"
                field={field}
                variants={Object.keys(schemas)}
              />
            )}
          />

          <FormField
            control={form.control}
            name="formHeightInPx"
            render={({ field }) => (
              <InputFormField
                name="Height (in px)"
                tooltip="Height of the form container, in pixels"
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
