import { z } from "zod";

import { AccordZSchema } from "./api/accord";
import { ConcordSchema } from "./schema";

export const ButtonStyleVariants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
] as const;

export const TextStyleVariants = [
  "normal",
  "bold",
  "italic",
  "underline",
] as const;
export const OrientationVariants = ["center", "left", "right"] as const;

export const TextBlockTypeVariants = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "Paragraph",
] as const;

export const ButtonTypeVariants = ["button", "submit", "reset"] as const;

export const EventVariants = ["Do Nothing", "Redirect To Route"] as const;
export const InputVariants = ["text", "password", "number"] as const;
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

export const BarchartPropsZSchema = z.object({
  barchartId: z
    .string({ required_error: "Required barchartId" })
    .min(10)
    .startsWith("barchart-", "ID must start with the prefix `barchart-`"),
  barchartTitle: z.string().min(1),
  barchartDescription: z.string().min(1),
  accord: AccordZSchema.nullable(),
  accordId: z.string().nullable(),
  dataKey: z.string(),
  barchartInsightTitle: z.string().min(1),
  barchartInsightDescription: z.string().min(1),
  barchartHeightInPx: z
    .string()
    .max(5)
    .endsWith("px", "Please enter a value in px, for example: 100px"),
});

export const TextBlockPropsZSchema = z.object({
  textBlockId: z
    .string({ required_error: "Required textBlockId" })
    .min(11)
    .startsWith("textBlock-", "ID must start with the prefix `textBlock-`"),
  textBlockText: z.string().min(1),
  textBlockType: z.enum(TextBlockTypeVariants),
  textBlockStyle: z.enum(TextStyleVariants),
  textBlockOrientation: z.enum(OrientationVariants),
  isFormElement: z.boolean().default(false),
});

export const ButtonPropsZSchema = z.object({
  buttonId: z
    .string({ required_error: "Required buttonId" })
    .min(7)
    .startsWith("button-", "ID must start with the prefix `button-`"),
  buttonText: z.string().min(1),
  buttonType: z.enum(ButtonTypeVariants),
  isFormElement: z.boolean().default(false),
  buttonVariant: z.enum(ButtonStyleVariants),
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
  isFormElement: z.boolean().default(false),
  schemaPropertyMapping: z.optional(
    z.object({
      name: z.string(),
      type: z.string(),
    })
  ),
});

export const DTablePropsZSchema = z.object({
  dTableId: z
    .string({ required_error: "Required dTableId" })
    .min(9)
    .startsWith("dTable-", "ID must start with the prefix `dTable-`"),
  accord: AccordZSchema.nullable(),
  accordId: z.string().nullable(),
  dTableHeightInPx: z
    .string()
    .max(5)
    .endsWith("px", "Please enter a value in px, for example: 100px"),
});

export const FormPropsZSchema = z.object({
  formId: z
    .string({ required_error: "Required formId" })
    .min(8)
    .startsWith("form-", "ID must start with the prefix `form-`"),
  accord: AccordZSchema.nullable(),
  accordId: z.string().nullable(),
  formHeightInPx: z
    .string()
    .max(5)
    .endsWith("px", "Please enter a value in px, for example: 100px"),
});

export type SchemaVariants = Record<string, ConcordSchema>;

export type ButtonPropsSchema = z.infer<typeof ButtonPropsZSchema>;
export type HContainerPropsSchema = z.infer<typeof HContainerPropsZSchema>;
export type InputPropsSchema = z.infer<typeof InputPropsZSchema>;
export type DTablePropsSchema = z.infer<typeof DTablePropsZSchema>;
export type FormPropsSchema = z.infer<typeof FormPropsZSchema>;
export type TextBlockPropsSchema = z.infer<typeof TextBlockPropsZSchema>;
export type BarchartPropsSchema = z.infer<typeof BarchartPropsZSchema>;

export type PropsSchema =
  | ButtonPropsSchema
  | HContainerPropsSchema
  | DTablePropsSchema
  | FormPropsSchema
  | TextBlockPropsSchema
  | BarchartPropsSchema
  | InputPropsSchema;

export type CustomPropsSchema = ButtonPropsSchema &
  HContainerPropsSchema &
  DTablePropsSchema &
  FormPropsSchema &
  TextBlockPropsSchema &
  BarchartPropsSchema &
  InputPropsSchema;

export type VariantsSchema =
  | typeof ButtonStyleVariants
  | typeof TextBlockTypeVariants
  | typeof OrientationVariants
  | typeof TextStyleVariants
  | typeof ButtonTypeVariants
  | typeof EventVariants
  | typeof HContainerColumnVariants
  | string[]
  | typeof InputVariants;
