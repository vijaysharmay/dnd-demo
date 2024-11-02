import Fastify from "fastify";
import departmentRoutes from "./modules/department/department.route";
import { departmentSchemas } from "./modules/department/department.schema";
import employeeRoutes from "./modules/employee/employee.route";
import { employeeSchemas } from "./modules/employee/employee.schema";

function buildServer() {
  const server = Fastify();

  server.get("/healthcheck", async function () {
    return { status: "OK" };
  });

  for (const schema of [...employeeSchemas, ...departmentSchemas]) {
    server.addSchema(schema);
  }

  server.register(departmentRoutes, { prefix: "api/departments" });
  server.register(employeeRoutes, { prefix: "api/employees" });

  return server;
}

export default buildServer;
