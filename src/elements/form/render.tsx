import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertJSONSchemaToZod, createEmptyObjectFromSchema } from "@/lib/utils";
import useSchemaStore from "@/store/schema-store";
import { ComponentElementInstance } from "@/types";
import { FormPropsSchema, InputPropsSchema } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";

import type { JSONSchema7 } from "json-schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FormFieldRender } from "../common/form-fields";

export const FormRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props, children } = elementInstance;
  const { formHeightInPx, onSubmitUrl, responseSchemaMapping } =
    props as FormPropsSchema;
  const { schemas } = useSchemaStore();

  const dataSchema: JSONSchema7 = schemas[responseSchemaMapping].schema;
  const zDataSchema = convertJSONSchemaToZod(dataSchema);
  type FormSchema = z.infer<typeof zDataSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(zDataSchema),
    defaultValues: createEmptyObjectFromSchema(dataSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    console.log(onSubmitUrl, data);
  };

  return (
    <div className="w-full p-4" style={{ minHeight: formHeightInPx }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          {children.length > 0 &&
            children.map((element) => {
              if (element) {
                const props = element.props as InputPropsSchema;
                return (
                  <FormField
                    key={props.inputId}
                    control={form.control}
                    name={props.schemaPropertyMapping?.name as string}
                    render={({ field }) => (
                      <FormFieldRender
                        name={props.inputLabel}
                        tooltip={props.helperText}
                        children={
                          props.schemaPropertyMapping?.type === "boolean" ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["true", "false"].map((variant: string) => {
                                  return (
                                    <SelectItem key={variant} value={variant}>
                                      {variant}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input {...field} />
                          )
                        }
                      />
                    )}
                  />
                );
              }
            })}
          <div className="grid grid-cols-4 gap-x-4 py-2">
            <div className="col-span-1"></div>
            <Button type="reset">Reset</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
      {JSON.stringify(form.formState.errors)}
    </div>
  );
};
