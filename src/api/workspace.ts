import {
  WorkspaceMembersSchema,
  WorkspaceMembersZSchema,
} from "@/types/api/workspace";
import { z } from "zod";

export const CreateWorkspaceRequestZSchema = z
  .object({
    name: z.string().min(1, "Workspace Name Required"),
    route: z.string().min(1, "Workspace Route Required"),
    members: z.array(
      z.object({
        memberId: z.string(),
        role: z.string(),
      })
    ),
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

export const getUsersInWorkspace = async (
  workspaceId: string
): Promise<WorkspaceMembersSchema> => {
  // for showcasing loading icon
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }
  const url = `http://localhost:3000/workspace/${workspaceId}/member`;
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
  const result = WorkspaceMembersZSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error fetching current user details");
  }

  return result.data;
};
