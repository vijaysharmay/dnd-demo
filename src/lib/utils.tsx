import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { libraryElements } from "@/elements";
import { Block } from "@/pages/app/published-apps";
import { ComponentElementInstance, ComponentElementType } from "@/types";
import { BlockSchema } from "@/types/api/page";
import { PageSchema, ProjectSchema, WorkspaceSchema } from "@/types/api/user";
import { CustomPropsSchema, InputPropsSchema } from "@/types/properties";
import { ClassValue, clsx } from "clsx";
import {
  JSONSchema4TypeName,
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { capitalize, includes, isNull, keys } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { v4 } from "uuid";
import { z, ZodTypeAny } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randInt() {
  return Math.floor(Math.random() * 1000) + 1;
}

export function convertJSONSchemaToZod(schema: JSONSchema7): ZodTypeAny {
  const { required, properties } = schema;

  const zSchemaTypeMappings: Record<string, ZodTypeAny> = {
    number: z.coerce.number().positive(),
    string: z.string(),
    boolean: z.enum(["true", "false"]).transform((value) => value === "true"),
  };

  const schemaObj: Record<string, ZodTypeAny> = {};
  if (properties) {
    keys(properties).forEach((prop: string) => {
      const property = properties[prop] as JSONSchema7;
      const propertyType = property.type as JSONSchema7TypeName;
      if (includes(required, prop)) {
        schemaObj[prop] = zSchemaTypeMappings[propertyType];
      } else {
        schemaObj[prop] = z.optional(zSchemaTypeMappings[propertyType]);
      }
    });
  }

  return z.object(schemaObj).required();
}

export function createEmptyObjectFromSchema(schema: JSONSchema7) {
  const result: { [x: string]: string | number | boolean | object | null } = {};
  if (schema.properties) {
    const { properties } = schema;
    Object.entries(properties).forEach(([key, property]) => {
      const propSchema = property as JSONSchema7;
      switch (propSchema.type as JSONSchema7TypeName) {
        case "string":
          result[key] = "";
          break;
        case "number":
          result[key] = 0;
          break;
        case "boolean":
          result[key] = false;
          break;
        case "object":
          result[key] = createEmptyObjectFromSchema(propSchema); // Recursive call for nested objects
          break;
        case "array":
          result[key] = [];
          break;
        default:
          result[key] = null; // Fallback for unsupported types
      }
    });
  }
  return result;
}

export function initFormChildren(
  schemaName: string
): (ComponentElementInstance | null)[] {
  const schemaStore = localStorage["schemaStore"];
  if (isNull(schemaStore)) return [];
  const schema: JSONSchema7 =
    JSON.parse(schemaStore).state.schemas[schemaName].schema;

  if (isNull(schema.properties)) return [];

  const children: (ComponentElementInstance | null)[] = keys(
    schema.properties
  ).map((prop: string) => {
    if (schema.properties) {
      const propObj: JSONSchema7Definition = schema.properties[prop];
      const inputInstanceProps: InputPropsSchema = {
        inputId: `input-${randInt()}`,
        inputLabel: capitalize(prop),
        placeHolder: capitalize(prop),
        helperText: capitalize(prop),
        inputType: "text",
        isFormElement: true,
        schemaPropertyMapping: {
          name: prop,
          type: (propObj as JSONSchema7).type as JSONSchema4TypeName,
        },
      };
      return libraryElements.Input.create(
        v4(),
        inputInstanceProps as CustomPropsSchema
      );
    } else {
      return null;
    }
  });
  return children;
}

export interface Tree {
  id: string;
  parentId?: string;
  name: string;
  type: string;
  url: string;
  children?: Tree[];
}

export function convertToTree(data: WorkspaceSchema): Tree {
  const mapWorkspaceToTree = (workspace: WorkspaceSchema): Tree => ({
    id: workspace.id,
    name: workspace.name,
    type: "workspace",
    url: `/workspace/${workspace.id}`,
    children: (workspace.projects || []).map((project: ProjectSchema) =>
      mapProjectToTree(workspace.id, project)
    ),
  });

  const mapProjectToTree = (
    workspaceId: string,
    project: ProjectSchema
  ): Tree => ({
    id: project.id,
    parentId: workspaceId,
    name: project.name,
    type: "project",
    url: `/workspace/${workspaceId}/project/${project.id}`,
    children: (project.pages || []).map((page: PageSchema) =>
      mapPageToTree(workspaceId, project.id, page)
    ),
  });

  const mapPageToTree = (
    workspaceId: string,
    projectId: string,
    page: PageSchema
  ): Tree => ({
    id: page.id,
    parentId: projectId,
    name: page.name,
    type: "page",
    url: `/workspace/${workspaceId}/project/${projectId}/page/${page.id}`,
  });

  // Assuming we start from userWorkspace
  return mapWorkspaceToTree(data);
}

export function NodeOptionsItem({
  name,
  icon,
  form,
  open,
  onOpenChange,
}: {
  name: string;
  icon: React.ReactElement;
  form: React.ReactElement;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <ContextMenuItem
          className="gap-2 p-2"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background text-muted-foreground">
            {icon}
          </div>
          <div className="font-medium text-muted-foreground">{name}</div>
        </ContextMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        {form}
      </DialogContent>
    </Dialog>
  );
}

export function blockToElement(block: Block | BlockSchema) {
  const { id, blockType, parentId, children, props } = block;
  const type: ComponentElementType = blockType as ComponentElementType;
  const element: ComponentElementInstance = {
    id,
    type,
    props,
    parentId,
    children: children.map(blockToElement),
  };
  return element;
}
