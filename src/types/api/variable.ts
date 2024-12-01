import { z } from "zod";

export const ConcordVariableZSchema = z.object({
  id: z.string(),
  accordName: z.string(),
  accordType: z.string(),
  accordSchema: z.string(),
  accordVersion: z.string(),
  accordAPIUrl: z.string(),
});

export const GetConcordVariableZResponseSchema = z.array(
  ConcordVariableZSchema
);
export type GetConcordVariableResponseSchema = z.infer<
  typeof GetConcordVariableZResponseSchema
>;
export type ConcordVariableSchema = z.infer<typeof ConcordVariableZSchema>;
