import PropertiesElementWrapper from "@/containers/properties-element.wrapper";
import { ComponentElementInstance } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  ButtonPropsSchema,
  ButtonPropsZSchema,
  ButtonVariants,
  EventVariants,
} from "@/types/properties";
import { isEmpty } from "lodash";
import { InputFormField, SelectFormField } from "../common/form-fields";
import { handlePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const ButtonPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<ButtonPropsSchema>({
    resolver: zodResolver(ButtonPropsZSchema),
    values: elementInstance.props as ButtonPropsSchema,
  });

  const onSubmit: SubmitHandler<ButtonPropsSchema> = (data) =>
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
            name="buttonId"
            render={({ field }) => (
              <InputFormField
                name="Button ID"
                tooltip="A unique identifier which is useful when crafting events"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <InputFormField
                name="Button Text"
                tooltip="Text inside the button"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="buttonVariant"
            render={({ field }) => (
              <SelectFormField
                name="Button Variants"
                tooltip="Variant of Button"
                field={field}
                variants={ButtonVariants}
              />
            )}
          />

          <FormField
            control={form.control}
            name="onClickHandler"
            render={({ field }) => (
              <SelectFormField
                name="On Click Workflow"
                tooltip="Choose what to do when you click this button"
                field={field}
                variants={EventVariants}
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
