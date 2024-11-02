import { FastifyRequest } from "fastify";

import { createEmployeeInput } from "./employee.schema";
import { createEmployee, getEmployees } from "./employee.service";

export async function createEmployeeHandler(
  request: FastifyRequest<{
    Body: createEmployeeInput;
  }>
) {
  const employee = await createEmployee(request.body);

  return employee;
}

export async function getEmployeesHandler() {
  const employees = await getEmployees();

  return employees;
}
