import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const departmentInput = {
  departmentName: z.string(),
};

const departmentGenerated = {
  id: z.string().uuid(),
};

const createDepartmentSchema = z.object({
  ...departmentInput,
});

const departmentResponseSchema = z.object({
  ...departmentInput,
  ...departmentGenerated,
});

const departmentsResponseSchema = z.array(departmentResponseSchema);

export type createDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const { schemas: departmentSchemas, $ref } = buildJsonSchemas(
  {
    createDepartmentSchema,
    departmentResponseSchema,
    departmentsResponseSchema,
  },
  {
    $id: "departmentSchemas",
  }
);
