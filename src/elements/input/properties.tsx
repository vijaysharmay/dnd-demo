import PropertiesElementWrapper from "@/containers/properties-element.wrapper";
import { ComponentElementInstance } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  InputPropsSchema,
  InputPropsZSchema,
  InputVariants,
} from "@/types/properties";
import { isEmpty } from "lodash";
import { InputFormField, SelectFormField } from "../common/form-fields";
import { handlePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const InputPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<InputPropsSchema>({
    resolver: zodResolver(InputPropsZSchema),
    values: elementInstance.props as InputPropsSchema,
  });

  const onSubmit: SubmitHandler<InputPropsSchema> = (data) =>
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
            name="inputId"
            render={({ field }) => (
              <InputFormField
                name="Input ID"
                tooltip="A unique identifier which is useful when crafting events"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="inputLabel"
            render={({ field }) => (
              <InputFormField
                name="Input Label"
                tooltip="Label for the Input Element"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="inputType"
            render={({ field }) => (
              <SelectFormField
                name="Input Type"
                tooltip="Type of Input"
                field={field}
                variants={InputVariants}
              />
            )}
          />

          <FormField
            control={form.control}
            name="helperText"
            render={({ field }) => (
              <InputFormField
                name="Helper Text"
                tooltip="Helper Text For Input Element"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="placeHolder"
            render={({ field }) => (
              <InputFormField
                name="Placeholder"
                tooltip="Placeholder For Input Element"
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
