import { FastifyRequest } from "fastify";

import { createDepartmentInput } from "./department.schema";
import { createDepartment, getDepartments } from "./department.service";

export async function createDepartmentHandler(
  request: FastifyRequest<{
    Body: createDepartmentInput;
  }>
) {
  const department = await createDepartment(request.body);

  return department;
}

export async function getDepartmentsHandler() {
  const departments = await getDepartments();

  return departments;
}
