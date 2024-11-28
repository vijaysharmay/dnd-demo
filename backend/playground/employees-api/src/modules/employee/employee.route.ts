import { FastifyInstance } from "fastify";

import {
  createEmployeeHandler,
  getEmployeesHandler,
} from "./employee.controller";
import { $ref } from "./employee.schema";

async function EmployeeRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createEmployeeSchema"),
        response: {
          201: $ref("employeeResponseSchema"),
        },
      },
    },
    createEmployeeHandler
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: $ref("employeesResponseSchema"),
        },
      },
    },

    getEmployeesHandler
  );
}

export default EmployeeRoutes;
