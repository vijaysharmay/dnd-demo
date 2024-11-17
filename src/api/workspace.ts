import { z } from "zod";

export const LOGIN_URL = "";

export const CreateWorkspaceRequestZSchema = z
  .object({
    name: z.string().min(1, "Workspace Name Required"),
    route: z.string().min(1, "Workspace Route Required"),
  })
  .required();

export type CreateWorkspaceRequestSchema = z.infer<
  typeof CreateWorkspaceRequestZSchema
>;

const CreateWorkspaceZResponseSchema = z.object({
  id: z.string().min(1),
});

export type CreateWorkspaceResponseSchema = z.infer<
  typeof CreateWorkspaceZResponseSchema
>;

export const createWorkspace = async (
  values: CreateWorkspaceRequestSchema
): Promise<CreateWorkspaceResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }
  const url = `http://localhost:3000/workspace`;
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
  console.log(data);
  const result = CreateWorkspaceZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating Workspace - response schema mismatch");
  }

  return result.data;
};

