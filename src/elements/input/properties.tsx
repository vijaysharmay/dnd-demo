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
  InputPropsSchema,
  InputPropsZSchema,
  InputVariants,
} from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import useVersionStore from "@/store/page-store";
import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const InputPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<InputPropsSchema>({
    resolver: zodResolver(InputPropsZSchema),
    values: elementInstance.props as InputPropsSchema,
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
              <FormFieldRender
                name="Input ID"
                tooltip="A unique identifier which is useful when crafting events"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="inputLabel"
            render={({ field }) => (
              <FormFieldRender
                name="Input Label"
                tooltip="Label for the Input Element"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="inputType"
            render={({ field }) => (
              <FormFieldRender
                name="Input Type"
                tooltip="Type of Input"
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
                      {InputVariants.map((variant: string) => {
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
            name="helperText"
            render={({ field }) => (
              <FormFieldRender
                name="Helper Text"
                tooltip="Helper Text For Input Element"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="placeHolder"
            render={({ field }) => (
              <FormFieldRender
                name="Placeholder"
                tooltip="Placeholder For Input Element"
                children={<Input type="text" {...field} />}
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
