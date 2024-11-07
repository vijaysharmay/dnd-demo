import { z } from 'zod';

export const ROLES = ['ADMIN', 'DESIGNER', 'DEVELOPER', 'OWNER'] as const;

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const JSONZType: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(JSONZType), z.record(JSONZType)]),
);
