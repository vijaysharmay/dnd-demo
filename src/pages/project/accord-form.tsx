import {
  createAccordInProjectWorkspace,
  CreateAccordRequestSchema,
  CreateAccordRequestZSchema,
  updateAccordInProjectWorkspace,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { apiMethods } from "@/types/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { Monaco, Editor as SchemaEditor } from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import Ajv from "ajv";
import { isNull, keys } from "lodash";
import { editor } from "monaco-editor";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export default function AccordForm({
  mode = "create",
  workspaceId,
  projectId,
  accordId,
  initialValues,
}: {
  mode: "create" | "update";
  workspaceId: string;
  projectId: string;
  accordId?: string; // Only required for update
  initialValues?: CreateAccordRequestSchema;
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

  const formDefaults: CreateAccordRequestSchema = {
    accordName: "",
    accordSchema: "",
    accordVersion: "",
    accordAPIUrl: "",
    accordAPIUrlMethod: "",
  };

  const formMethods = useForm<CreateAccordRequestSchema>({
    resolver: zodResolver(CreateAccordRequestZSchema),
    values: initialValues || formDefaults,
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
      console.error(e.message);
    },
  });

  const updateAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      accordId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      accordId: string;
      values: CreateAccordRequestSchema;
    }) =>
      updateAccordInProjectWorkspace(workspaceId, projectId, accordId, values),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.error(e.message);
    },
  });

  const handleFormSubmit = (values: CreateAccordRequestSchema) => {
    if (mode === "create") {
      createAccordMutation.mutate({ workspaceId, projectId, values });
    } else if (mode === "update" && accordId) {
      updateAccordMutation.mutate({ workspaceId, projectId, accordId, values });
    } else {
      console.error("Accord ID is required for update mode.");
    }
  };

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const schemaEditorOptions: editor.IStandaloneEditorConstructionOptions = {
    readOnly: false,
    minimap: { enabled: false },
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  return (
    <Form {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(handleFormSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={formMethods.control}
          name="accordName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord name"
                  className={cn(
                    formMethods.formState.errors["accordName"] && "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formMethods.control}
          name="accordSchema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Schema</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "border border-gray-200 rounded",
                    formMethods.formState.errors["accordSchema"] &&
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
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formMethods.control}
          name="accordVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Version</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord version"
                  className={cn(
                    formMethods.formState.errors["accordVersion"] && "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formMethods.control}
          name="accordAPIUrlMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord API URL Method</FormLabel>
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
                  {keys(apiMethods).map((key: string) => {
                    return (
                      <SelectItem key={key} value={key}>
                        <span className={apiMethods[key]}>
                          {key}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formMethods.control}
          name="accordAPIUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord API URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord API URL"
                  className={cn(
                    formMethods.formState.errors["accordAPIUrl"] && "bg-red-50"
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
            {mode === "create" ? "Create" : "Update"} Accord
          </Button>
        </div>
      </form>
    </Form>
  );
}
