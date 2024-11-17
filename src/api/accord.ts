import { z } from "zod";

export const LOGIN_URL = "";

export const CreateAccordRequestZSchema = z
  .object({
    name: z.string().min(1, "Accord Name Required"),
    route: z.string().min(1, "Accord Route Required"),
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
