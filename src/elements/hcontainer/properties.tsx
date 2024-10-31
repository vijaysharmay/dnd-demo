import PropertiesElementWrapper from "@/containers/properties-element.wrapper";
import { ComponentElementInstance } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  HContainerColumnVariants,
  HContainerPropsSchema,
  HContainerPropsZSchema,
} from "@/types/properties";
import { isEmpty } from "lodash";
import { InputFormField, SelectFormField } from "../common/form-fields";
import { handlePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const HContainerPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<HContainerPropsSchema>({
    resolver: zodResolver(HContainerPropsZSchema),
    values: elementInstance.props as HContainerPropsSchema,
  });

  const onSubmit: SubmitHandler<HContainerPropsSchema> = (data) =>
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
            name="hContainerId"
            render={({ field }) => (
              <InputFormField
                name="Horizontal Container ID"
                tooltip="A unique identifier which is useful when crafting events"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="hContainerHeightInPx"
            render={({ field }) => (
              <InputFormField
                name="Height (in px)"
                tooltip="Height of the horizontal container, in pixels"
                field={field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="hContainerColumns"
            render={({ field }) => (
              <SelectFormField
                name="# of Columns"
                tooltip="Number of columns in the container"
                field={field}
                variants={HContainerColumnVariants}
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
