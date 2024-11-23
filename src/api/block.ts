import { JSONZType } from "@/types/api/common";
import { z } from "zod";

export const CreateBlockRequestZSchema = z
  .object({
    blockType: z.string(),
    props: JSONZType,
    depth: z.number(),
    position: z.number(),
  })
  .required();

export type CreateBlockRequestSchema = z.infer<
  typeof CreateBlockRequestZSchema
>;

const CreateBlockZResponseSchema = z.object({
  id: z.string().min(1),
});

export type CreateBlockResponseSchema = z.infer<
  typeof CreateBlockZResponseSchema
>;

export const createBlockInPage = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  values: CreateBlockRequestSchema
): Promise<CreateBlockResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/block`;
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
  const result = CreateBlockZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating Block - response schema mismatch");
  }

  return result.data;
};

export const removeBlockFromPage = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  blockId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/block/${blockId}`;
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

  return true;
};

export const updateBlockPropsInPage = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  blockId: string,
  props: z.infer<typeof JSONZType>
): Promise<CreateBlockResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/block/${blockId}`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({ props }),
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
  const result = CreateBlockZResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Error creating Block - response schema mismatch");
  }

  return result.data;
};
