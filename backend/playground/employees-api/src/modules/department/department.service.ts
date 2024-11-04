import prisma from "../../utils/prisma";
import { createDepartmentInput } from "./department.schema";

export async function createDepartment(data: createDepartmentInput) {
  return prisma.department.create({
    data,
  });
}

export function getDepartments() {
  return prisma.department.findMany();
}
