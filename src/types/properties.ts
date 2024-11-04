import { z } from "zod";

import { ConcordSchema } from "./schema";

export const ButtonVariants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
] as const;

export const EventVariants = ["Do Nothing", "Redirect To Route"] as const;
export const InputVariants = ["text", "password"] as const;
export const HContainerColumnVariants = [
  "One",
  "Two",
  "Three",
  "Four",
] as const;

export const colsIntRec: Record<string, number> = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
};

export const ButtonPropsZSchema = z.object({
  buttonId: z
    .string({ required_error: "Required buttonId" })
    .min(7)
    .startsWith("button-", "ID must start with the prefix `button-`"),
  buttonText: z.string().min(1),
  buttonVariant: z.enum(ButtonVariants),
  onClickHandler: z.enum(EventVariants),
});

export const HContainerPropsZSchema = z.object({
  hContainerId: z
    .string({ required_error: "Required hContainerId" })
    .min(11)
    .startsWith("hContainer-", "ID must start with the prefix `hContainer-`"),
  hContainerHeightInPx: z
    .string()
    .max(5)
    .endsWith("px", "Please enter a value in px, for example: 100px"),
  hContainerColumns: z.enum(HContainerColumnVariants),
});

export const InputPropsZSchema = z.object({
  inputId: z
    .string({ required_error: "Required inputId" })
    .min(8)
    .startsWith("input-", "ID must start with the prefix `input-`"),
  inputType: z.enum(InputVariants),
  inputLabel: z.string().min(1),
  helperText: z.string().min(1),
  placeHolder: z.string().min(1),
});

export const DTablePropsZSchema = z.object({
  dTableId: z
    .string({ required_error: "Required dTableId" })
    .min(10)
    .startsWith("dTable-", "ID must start with the prefix `dTable-`"),
  dataUrl: z.string().url(),
  responseSchemaMapping: z.string(),
  dTableHeightInPx: z
    .string()
    .max(5)
    .endsWith("px", "Please enter a value in px, for example: 100px"),
});

export type SchemaVariants = Record<string, ConcordSchema>;

export type ButtonPropsSchema = z.infer<typeof ButtonPropsZSchema>;
export type HContainerPropsSchema = z.infer<typeof HContainerPropsZSchema>;
export type InputPropsSchema = z.infer<typeof InputPropsZSchema>;
export type DTablePropsSchema = z.infer<typeof DTablePropsZSchema>;

export type PropsSchema =
  | ButtonPropsSchema
  | HContainerPropsSchema
  | DTablePropsSchema
  | InputPropsSchema;

export type VariantsSchema =
  | typeof ButtonVariants
  | typeof EventVariants
  | typeof HContainerColumnVariants
  | string[]
  | typeof InputVariants;
