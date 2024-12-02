import { z } from "zod";

export const AccordZSchema = z.object({
  id: z.string(),
  accordName: z.string(),
  accordSchema: z.string(),
  accordVersion: z.string(),
  accordAPIUrl: z.optional(z.string()),
  accordAPIUrlMethod: z.optional(z.string()),
});

export const GetAccordZResponseSchema = z.array(AccordZSchema);
export type GetAccordResponseSchema = z.infer<typeof GetAccordZResponseSchema>;
export type AccordSchema = z.infer<typeof AccordZSchema>;
