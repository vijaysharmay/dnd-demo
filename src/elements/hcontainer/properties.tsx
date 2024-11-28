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
import useVersionStore from "@/store/version-store";
import { ComponentElementInstance } from "@/types";
import {
  HContainerColumnVariants,
  HContainerPropsSchema,
  HContainerPropsZSchema,
} from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const HContainerPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<HContainerPropsSchema>({
    resolver: zodResolver(HContainerPropsZSchema),
    values: elementInstance.props as HContainerPropsSchema,
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

  const onSubmit: SubmitHandler<HContainerPropsSchema> = (data) =>
    handlePropertiesFormSubmit(data, elementInstance);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="hContainerId"
          render={({ field }) => (
            <FormFieldRender
              name="Horizontal Container ID"
              tooltip="A unique identifier which is useful when crafting events"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="hContainerHeightInPx"
          render={({ field }) => (
            <FormFieldRender
              name="Height (in px)"
              tooltip="Height of the horizontal container, in pixels"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="hContainerColumns"
          render={({ field }) => (
            <FormFieldRender
              name="# of Columns"
              tooltip="Number of columns in the container"
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
                    {HContainerColumnVariants.map((variant: string) => {
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
  );
};
