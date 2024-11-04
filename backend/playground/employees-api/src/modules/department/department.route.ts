import { FastifyInstance } from "fastify";

import {
  createDepartmentHandler,
  getDepartmentsHandler,
} from "./department.controller";
import { $ref } from "./department.schema";

async function departmentRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createDepartmentSchema"),
        response: {
          201: $ref("departmentResponseSchema"),
        },
      },
    },
    createDepartmentHandler
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: $ref("departmentsResponseSchema"),
        },
      },
    },

    getDepartmentsHandler
  );
}

export default departmentRoutes;
