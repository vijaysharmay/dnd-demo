import { z } from "zod";

export const CreatePageRequestZSchema = z
  .object({
    name: z.string().min(1, "Page Name Required"),
    route: z.string().min(1, "Page Route Required"),
  })
  .required();

export type CreatePageRequestSchema = z.infer<typeof CreatePageRequestZSchema>;

const CreatePageZResponseSchema = z.object({
  id: z.string().min(1),
});

export type CreatePageResponseSchema = z.infer<
  typeof CreatePageZResponseSchema
>;

export const createPageInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  values: CreatePageRequestSchema
): Promise<CreatePageResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page`;
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
  const result = CreatePageZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating Page - response schema mismatch");
  }

  return result.data;
};

export const deletePageInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  pageId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}`;
  const response = await fetch(url, {
    method: "DELETE",
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

  return data;
};
