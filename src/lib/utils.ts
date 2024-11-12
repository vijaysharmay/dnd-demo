import { libraryElements } from "@/elements";
import { ComponentElementInstance } from "@/types";
import { CustomPropsSchema, InputPropsSchema } from "@/types/properties";
import { ClassValue, clsx } from "clsx";
import {
  JSONSchema4TypeName,
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { capitalize, includes, isNull, keys } from "lodash";
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
