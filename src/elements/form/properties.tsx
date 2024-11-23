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
import PropertiesElementWrapper from "@/pages/page/properties-element.wrapper";
import useSchemaStore from "@/store/schema-store";
import { ComponentElementInstance } from "@/types";
import { FormPropsSchema, FormPropsZSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import usePageStore from "@/store/page-store";
import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const FormPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { schemas } = useSchemaStore();
  const form = useForm<FormPropsSchema>({
    resolver: zodResolver(FormPropsZSchema),
    values: elementInstance.props as FormPropsSchema,
  });

  const { currentPage } = usePageStore();
  if (!currentPage) throw new Error("no current page");
  const { workspace, project, id: pageId } = currentPage;

  const handlePropertiesFormSubmit = usePropertiesFormSubmit({
    workspaceId: workspace.id,
    projectId: project.id,
    pageId,
    blockId: elementInstance.id,
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
              <FormFieldRender
                name="Form ID"
                tooltip="A unique identifier which is useful when crafting events"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="onSubmitUrl"
            render={({ field }) => (
              <FormFieldRender
                name="On Submit URL"
                tooltip="A POST API Endpoint for submitting the form"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="responseSchemaMapping"
            render={({ field }) => (
              <FormFieldRender
                name="Response Schema"
                tooltip="Schema of the expected request for the URL"
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
                      {Object.keys(schemas).map((variant: string) => {
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
            name="formHeightInPx"
            render={({ field }) => (
              <FormFieldRender
                name="Height (in px)"
                tooltip="Height of the form container, in pixels"
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
