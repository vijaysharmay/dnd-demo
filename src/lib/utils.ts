import { clsx, type ClassValue } from "clsx";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { includes, keys } from "lodash";
import { twMerge } from "tailwind-merge";
import { z, ZodTypeAny } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randInt() {
  return Math.floor(Math.random() * 1000) + 1;
}

export function createZodSchema(schema: JSONSchema7) {
  return z.object({});
}

export function convertJSONSchemaToZod(schema: JSONSchema7): ZodTypeAny {
  const { required, properties } = schema;

  const zSchemaTypeMappings: Record<string, ZodTypeAny> = {
    number: z.number().positive(),
    string: z.string().min(1),
    boolean: z.boolean(),
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

  return z.object(schemaObj);
}
