import { GetAccordResponseSchema, GetAccordZResponseSchema } from "@/types/api/accord";
import Ajv from "ajv";
import { z } from "zod";

export const OPENAPI = "OPEN API v3";
export const JSONSCHEMA = "JSON SCHEMA v7";

export const CreateAccordRequestZSchema = z
  .object({
    accordName: z.string().min(1, "Accord Name Required"),
    accordType: z.enum(["OPENAPI", "JSONSCHEMA"]),
    accordSchema: z.custom((value) => {
      try {
        const ajv = new Ajv();
        const parsedSchema = JSON.parse(value);
        const validate = ajv.compile(parsedSchema);

        // Ensure the schema compiles successfully
        if (typeof validate !== "function") {
          throw new Error("Invalid Schema");
        } else {
          return true; // Pass validation if no errors
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return false;
      }
    }, "Invalid JSON Schema"),
    accordVersion: z.string().min(1, "Accord Version Required"),
    accordAPIUrl: z.nullable(z.string()),
  })
  .required();

export type CreateAccordRequestSchema = z.infer<
  typeof CreateAccordRequestZSchema
>;

const CreateAccordZResponseSchema = z.object({
  id: z.string().min(1),
});

export type CreateAccordResponseSchema = z.infer<
  typeof CreateAccordZResponseSchema
>;

// FUNCTIONS BEGIN

export const createAccordInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  values: CreateAccordRequestSchema
): Promise<CreateAccordResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/accord`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(values),
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 201) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  const result = CreateAccordZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating Accord - response schema mismatch");
  }

  return result.data;
};

export const updateAccordInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  accordId: string,
  values: CreateAccordRequestSchema
): Promise<CreateAccordResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/accord/${accordId}`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(values),
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  const result = CreateAccordZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error updating Accord - response schema mismatch");
  }

  return result.data;
};

export const deleteAccordInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  accordId: string
): Promise<CreateAccordResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/accord/${accordId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  return { id: accordId };
};

export const deleteBulkAccordInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  accordIds: string[]
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/accord?ids=${accordIds.join(",")}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  return data;
};

export const getAccordsInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string
): Promise<GetAccordResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/accord`;
  const response = await fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  const result = GetAccordZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating Accord - response schema mismatch");
  }

  return result.data;
};
