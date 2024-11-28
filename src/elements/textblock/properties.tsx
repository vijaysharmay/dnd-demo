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
  OrientationVariants,
  TextBlockPropsSchema,
  TextBlockPropsZSchema,
  TextBlockTypeVariants,
  TextStyleVariants,
} from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormFieldRender } from "../common/form-fields";
import { usePropertiesFormSubmit } from "../common/handlePropertiesFormSubmit";

export const TextBlockPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const form = useForm<TextBlockPropsSchema>({
    resolver: zodResolver(TextBlockPropsZSchema),
    values: elementInstance.props as TextBlockPropsSchema,
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

  const onSubmit: SubmitHandler<TextBlockPropsSchema> = (data) =>
    handlePropertiesFormSubmit(data, elementInstance);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="textBlockId"
          render={({ field }) => (
            <FormFieldRender
              name="TextBlock ID"
              tooltip="A unique identifier which is useful when crafting events"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="textBlockText"
          render={({ field }) => (
            <FormFieldRender
              name="TextBlock Text"
              tooltip="Text inside the TextBlock"
              children={<Input type="text" {...field} />}
            />
          )}
        />

        <FormField
          control={form.control}
          name="textBlockType"
          render={({ field }) => (
            <FormFieldRender
              name="TextBlock Type"
              tooltip="Type of TextBlock"
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
                    {TextBlockTypeVariants.map((variant: string) => {
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
          name="textBlockStyle"
          render={({ field }) => (
            <FormFieldRender
              name="TextBlock Style"
              tooltip="Style of TextBlock"
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
                    {TextStyleVariants.map((variant: string) => {
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
          name="textBlockOrientation"
          render={({ field }) => (
            <FormFieldRender
              name="TextBlock Variants"
              tooltip="Variant of TextBlock"
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
                    {OrientationVariants.map((variant: string) => {
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
