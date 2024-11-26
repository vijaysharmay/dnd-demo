import { z } from "zod";

export const AccordZSchema = z.object({
  id: z.string(),
  accordName: z.string(),
  accordType: z.string(),
  accordSchema: z.string(),
  accordVersion: z.string(),
  accordAPIUrl: z.string(),
});

export const GetAccordZResponseSchema = z.array(AccordZSchema);
export type GetAccordResponseSchema = z.infer<typeof GetAccordZResponseSchema>;
export type AccordSchema = z.infer<typeof AccordZSchema>;