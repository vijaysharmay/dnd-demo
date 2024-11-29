import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useVersionStore from "@/store/version-store";
import { ComponentElementInstance } from "@/types";
import { BarchartPropsSchema, BarchartPropsZSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, isNull } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import useAccordStore from "@/store/accord-store";
import { AccordSchema } from "@/types/api/accord";
import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const BarchartPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { accords } = useAccordStore();
  const form = useForm<BarchartPropsSchema>({
    resolver: zodResolver(BarchartPropsZSchema),
    values: elementInstance.props as BarchartPropsSchema,
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

  const onSubmit: SubmitHandler<BarchartPropsSchema> = (data) =>
    handlePropertiesFormSubmit(data, elementInstance);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="barchartId"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart ID"
              tooltip="A unique identifier which is useful when crafting events"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="barchartTitle"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Title"
              tooltip="Title of the barchart"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="barchartDescription"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Description"
              tooltip="Description of the barchart"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="accordId"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Data Accord"
              tooltip="Accord representing the schema of the barchart data"
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
          name="dataKey"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Data Key"
              tooltip="Data key of the barchart's categorical attribute"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="barchartInsightTitle"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Insight Title"
              tooltip="Insight title of the barchart"
              children={<Input type="text" {...field} />}
            />
          )}
        />
        <FormField
          control={form.control}
          name="barchartInsightDescription"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Insight Description"
              tooltip="Insight description of the barchart"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="barchartHeightInPx"
          render={({ field }) => (
            <FormFieldRender
              name="Barchart Height"
              tooltip="Height of the barchart"
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
