import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const employeeInput = {
  fullName: z.string(),
  employeeId: z.string(),
  salaryInRs: z.number(),
  departmentId: z.string().uuid(),
};

const employeeGenerated = {
  id: z.string().uuid(),
};

const createEmployeeSchema = z.object({
  ...employeeInput,
});

const employeeResponseSchema = z.object({
  ...employeeInput,
  ...employeeGenerated,
});

const employeesResponseSchema = z.array(employeeResponseSchema);

export type createEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const { schemas: employeeSchemas, $ref } = buildJsonSchemas(
  {
    createEmployeeSchema,
    employeeResponseSchema,
    employeesResponseSchema,
  },
  {
    $id: "employeeSchemas",
  }
);
