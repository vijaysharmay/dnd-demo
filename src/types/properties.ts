import { z } from "zod";

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

export type ButtonPropsSchema = z.infer<typeof ButtonPropsZSchema>;
export type HContainerPropsSchema = z.infer<typeof HContainerPropsZSchema>;
export type InputPropsSchema = z.infer<typeof InputPropsZSchema>;

export type PropsSchema =
  | ButtonPropsSchema
  | HContainerPropsSchema
  | InputPropsSchema;

export type VariantsSchema =
  | typeof ButtonVariants
  | typeof EventVariants
  | typeof HContainerColumnVariants
  | typeof InputVariants;
