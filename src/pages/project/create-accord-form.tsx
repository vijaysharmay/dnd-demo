import {
  createAccordInProjectWorkspace,
  CreateAccordRequestSchema,
  CreateAccordRequestZSchema,
  JSONSCHEMA,
  OPENAPI,
} from "@/api/accord";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Monaco, Editor as SchemaEditor } from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import Ajv from "ajv";
import { isNull } from "lodash";
import { editor } from "monaco-editor";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export default function CreateAccordForm({
  workspaceId,
  projectId,
  initialValues,
}: {
  workspaceId: string;
  projectId: string;
  initialValues: CreateAccordRequestSchema | null;
}) {
  const ajv = new Ajv();
  ajv.addVocabulary([
    "components",
    "externalDocs",
    "info",
    "openapi",
    "paths",
    "security",
    "servers",
    "content",
  ]);

  const createAccordForm = useForm<CreateAccordRequestSchema>({
    resolver: zodResolver(CreateAccordRequestZSchema),
    values: isNull(initialValues)
      ? {
          accordName: "",
          accordType: "JSONSCHEMA",
          accordSchema: "",
          accordVersion: "",
          accordAPIUrl: "",
        }
      : initialValues,
  });

  const createAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      values: CreateAccordRequestSchema;
    }) => createAccordInProjectWorkspace(workspaceId, projectId, values),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const onCreateAccordFormSubmit = (values: CreateAccordRequestSchema) => {
    createAccordMutation.mutate({ workspaceId, projectId, values });
  };

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const schemaEditorOptions: editor.IStandaloneEditorConstructionOptions = {
    readOnly: false,
    minimap: { enabled: false },
    // lineNumbers: "off",
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  return (
    <Form {...createAccordForm}>
      <form
        onSubmit={createAccordForm.handleSubmit(onCreateAccordFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={createAccordForm.control}
          name="accordName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord name"
                  className={cn(
                    createAccordForm.formState.errors["accordName"] &&
                      "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createAccordForm.control}
          name="accordType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Schema Type</FormLabel>
              <FormControl>
                <RadioGroup
                  className={cn(
                    createAccordForm.formState.errors["accordType"] &&
                      "bg-red-50"
                  )}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="OPENAPI" />
                    </FormControl>
                    <FormLabel className="font-normal">{OPENAPI}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="JSONSCHEMA" />
                    </FormControl>
                    <FormLabel className="font-normal">{JSONSCHEMA}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createAccordForm.control}
          name="accordSchema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Schema</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "border border-gray-200 rounded",
                    createAccordForm.formState.errors["accordVersion"] &&
                      "border-red-200"
                  )}
                >
                  <SchemaEditor
                    height="300px"
                    defaultLanguage="json"
                    defaultValue={field.value}
                    theme="dark"
                    options={schemaEditorOptions}
                    onChange={field.onChange}
                    onMount={handleEditorDidMount}
                    // beforeMount={handleEditorWillMount}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createAccordForm.control}
          name="accordVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Version</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord version"
                  className={cn(
                    createAccordForm.formState.errors["accordVersion"] &&
                      "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createAccordForm.control}
          name="accordAPIUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord API URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord API URL"
                  className={cn(
                    createAccordForm.formState.errors["accordVersion"] &&
                      "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-center">
          <Button className="mt-2 w-full" type="submit" variant="default">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
