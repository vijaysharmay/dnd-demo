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
import useAccordStore from "@/store/accord-store";
import useVersionStore from "@/store/version-store";
import { ComponentElementInstance } from "@/types";
import { AccordSchema } from "@/types/api/accord";
import { DTablePropsSchema, DTablePropsZSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, isNull } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const DTablePropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { accords } = useAccordStore();
  const form = useForm<DTablePropsSchema>({
    resolver: zodResolver(DTablePropsZSchema),
    values: elementInstance.props as DTablePropsSchema,
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

  const onSubmit: SubmitHandler<DTablePropsSchema> = (data) =>
    handlePropertiesFormSubmit(data, elementInstance);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
          name="accordId"
          render={({ field }) => (
            <FormFieldRender
              name="Accord"
              tooltip="Accord established at a project level"
              children={
                <Select
                  onValueChange={field.onChange}
                  defaultValue={isNull(field.value) ? "" : field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accords.map((accord: AccordSchema) => {
                      return (
                        <SelectItem key={accord.id} value={accord.id}>
                          {accord.accordName}
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
  );
};
