import prisma from "../../utils/prisma";
import { createEmployeeInput } from "./employee.schema";

export async function createEmployee(data: createEmployeeInput) {
  return prisma.employee.create({
    data,
  });
}

export function getEmployees() {
  return prisma.employee.findMany();
}
