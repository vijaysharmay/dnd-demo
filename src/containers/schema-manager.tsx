import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { editor } from "monaco-editor";
import { Editor as SchemaEditor, Monaco } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Ajv from "ajv";
import useSchemaStore from "@/store/schema-store";
import { ConcordSchema } from "@/types/schema";

export default function SchemaManager() {
  const options: editor.IStandaloneEditorConstructionOptions = {
    readOnly: false,
    minimap: { enabled: false },
    // lineNumbers: "off",
  };
  const ajv = new Ajv();

  const [schemaValue, setSchemaValue] = useState<string | undefined>("");
  const [schemaName, setSchemaName] = useState<string>("");
  const [isSchemaValid, setIsSchemaValid] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("showSchemas");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const { schemas, upsertSchema, removeSchema } = useSchemaStore();

  const handleEditorChange = (
    value: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: editor.IModelContentChangedEvent
  ) => {
    if (value) {
      try {
        const parsedValue = JSON.parse(value);
        ajv.compile(parsedValue);
      } catch (e: unknown) {
        setErrorMsg((e as Error).message);
        setIsSchemaValid(false);
        return;
      }
      setErrorMsg("");
      setIsSchemaValid(true);
      setSchemaValue(value);
    }

    if (value === "") {
      setErrorMsg("");
    }
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleSave = () => {
    const schemaObject: ConcordSchema = {
      name: schemaName,
      schema: schemaValue as string,
      sampleData: "",
    };
    upsertSchema(schemaName, schemaObject);
    setActiveTab("showSchemas");
  };

  const handleEdit = (schemaKey: string) => {
    setSchemaName(schemaKey);
    setSchemaValue(schemas[schemaKey].schema);
    setActiveTab("upsertSchema");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white">Schema Manager</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[calc(50%)]">
        <DialogHeader className="">
          <DialogTitle>Schema Manager</DialogTitle>
          <DialogDescription>
            Manage your JSON / OpenAPI schemas for building data-driven UI
            Blocks
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="showSchemas" value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="showSchemas"
              onClick={() => {
                setSchemaName("");
                setSchemaValue("");
                setActiveTab("showSchemas");
              }}
            >
              Show Schemas
            </TabsTrigger>
            <TabsTrigger
              value="upsertSchema"
              onClick={() => setActiveTab("upsertSchema")}
            >
              Add / Edit Schema
            </TabsTrigger>
          </TabsList>
          <TabsContent value="showSchemas" className="min-h-96">
            {Object.keys(schemas).length > 0 ? (
              <>
                {Object.keys(schemas).map((schemaKey: string) => (
                  <div className="flex flex-row items-center gap-4 my-2 ml-2">
                    <div className="text-lg grow">{schemaKey}</div>
                    <Button
                      className="h-6"
                      onClick={() => handleEdit(schemaKey)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="h-6"
                      onClick={() => removeSchema(schemaKey)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center pt-48 text-lg">
                No Schemas Present
              </div>
            )}
          </TabsContent>
          <TabsContent value="upsertSchema" className="">
            <div className="grid grid-cols-12 items-center gap-2 mb-4">
              <Label htmlFor="name" className="text-center col-span-1">
                Name
              </Label>
              <Input
                id="name"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className={cn(
                  "col-span-11",
                  schemaName === "" && "border-red-400 border-2"
                )}
              />
            </div>
            <div className="min-h-[250px] p-4 bg-gray-100">
              <SchemaEditor
                height="250px"
                defaultLanguage="json"
                defaultValue={schemaValue}
                theme="dark"
                options={options}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                // beforeMount={handleEditorWillMount}
              />
            </div>
            <p>{errorMsg}</p>
            <Button
              className={cn("w-full mt-4")}
              disabled={
                !isSchemaValid ||
                schemaName === "" ||
                errorMsg !== "" ||
                schemaValue === ""
              }
              onClick={handleSave}
            >
              Save
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
