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
import { DTablePropsSchema, DTablePropsZSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";
import usePageStore from "@/store/page-store";

export const DTablePropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { schemas } = useSchemaStore();
  const form = useForm<DTablePropsSchema>({
    resolver: zodResolver(DTablePropsZSchema),
    values: elementInstance.props as DTablePropsSchema,
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
              <FormFieldRender
                name="Data Table ID"
                tooltip="A unique identifier which is useful when crafting events"
                children={<Input type="text" {...field} />}
              />
            )}
          />

          <FormField
            control={form.control}
            name="dataUrl"
            render={({ field }) => (
              <FormFieldRender
                name="Data URL"
                tooltip="A GET API Endpoint for rendering the data table"
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
                tooltip="Schema of the expected response from the data URL"
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
            name="dTableHeightInPx"
            render={({ field }) => (
              <FormFieldRender
                name="Height (in px)"
                tooltip="Height of the horizontal container, in pixels"
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
