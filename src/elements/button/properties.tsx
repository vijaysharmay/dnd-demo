import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertiesElementWrapper from "@/pages/version/properties-element.wrapper";
import { ComponentElementInstance } from "@/types";
import {
  ButtonPropsSchema,
  ButtonPropsZSchema,
  ButtonStyleVariants,
  EventVariants,
} from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import useVersionStore from "@/store/page-store";
import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const ButtonPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<ButtonPropsSchema>({
    resolver: zodResolver(ButtonPropsZSchema),
    values: elementInstance.props as ButtonPropsSchema,
  });

  const { currentVersion } = useVersionStore();
  if (!currentVersion) throw new Error("no current page");
  const { workspace, project, page, id: versionId } = currentVersion;

  const handlePropertiesFormSubmit = usePropertiesFormSubmit({
    workspaceId: workspace.id,
    projectId: project.id,
    pageId: page.id,
    versionId,
    blockId: elementInstance.id,
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
              <FormFieldRender
                name="Button ID"
                tooltip="A unique identifier which is useful when crafting events"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormFieldRender
                name="Button Text"
                tooltip="Text inside the button"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="buttonVariant"
            render={({ field }) => (
              <FormFieldRender
                name="Button Variants"
                tooltip="Variant of Button"
                children={
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a variant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ButtonStyleVariants.map((variant: string) => {
                        return (
                          <SelectItem key={variant} value={variant}>
                            {variant}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="onClickHandler"
            render={({ field }) => (
              <FormFieldRender
                name="On Click Workflow"
                tooltip="Choose what to do when you click this button"
                children={
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a variant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EventVariants.map((variant: string) => {
                        return (
                          <SelectItem key={variant} value={variant}>
                            {variant}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                }
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
