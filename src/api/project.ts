import { z } from "zod";

export const CreateProjectRequestZSchema = z
  .object({
    name: z.string().min(1, "Project Name Required"),
    route: z.string().min(1, "Project Route Required"),
  })
  .required();

export type CreateProjectRequestSchema = z.infer<
  typeof CreateProjectRequestZSchema
>;

const CreateProjectZResponseSchema = z.object({
  id: z.string().min(1),
});

export type CreateProjectResponseSchema = z.infer<
  typeof CreateProjectZResponseSchema
>;

export const createProjectInWorkspace = async (
  workspaceId: string,
  values: CreateProjectRequestSchema
): Promise<CreateProjectResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project`;
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
  const result = CreateProjectZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating project - response schema mismatch");
  }

  return result.data;
};

export const deleteProjectInWorkspace = async (
  workspaceId: string,
  projecctId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  console.log(response.status);
  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  return true;
};

export const moveProjectToNewWorkspace = async (
  workspaceId: string,
  projectId: string,
  newWorkspaceId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }
  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/move`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ newWorkspaceId }),
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 201) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  return true;
};
