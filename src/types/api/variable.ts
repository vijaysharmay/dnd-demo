import { z } from "zod";

export const ConcordVariableZSchema = z.object({
  id: z.string(),
  name: z.string(),
  accordId: z.string().nullable(),
});

export const GetConcordVariableZResponseSchema = z.array(
  ConcordVariableZSchema
);
export type GetConcordVariableResponseSchema = z.infer<
  typeof GetConcordVariableZResponseSchema
>;
export type ConcordVariableSchema = z.infer<typeof ConcordVariableZSchema>;
 