import { JSONZType } from "@/types/api/common";
import { z } from "zod";

export const CreateBlockRequestZSchema = z
  .object({
    id: z.string(),
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

export const createBlockInPageVersion = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  versionId: string,
  values: CreateBlockRequestSchema
): Promise<CreateBlockResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/version/${versionId}/block`;
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

export const removeBlockFromPageVersion = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  versionId: string,
  blockId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/version/${versionId}/block/${blockId}`;
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

export const addChildToBlock = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  versionId: string,
  blockId: string,
  values: CreateBlockRequestSchema
): Promise<CreateBlockResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/version/${versionId}/block/${blockId}/child`;
  const response = await fetch(url, {
    method: "PUT",
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

export const addChildrenToBlock = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  versionId: string,
  blockId: string,
  values: CreateBlockRequestSchema[]
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }
  console.log(values);
  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/version/${versionId}/block/${blockId}/child/bulk`;
  const response = await fetch(url, {
    method: "PUT",
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
  console.log("addChildrenToBlock", data);

  return true;
};

export const updateBlockPropsInPageVersion = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  versionId: string,
  blockId: string,
  props: z.infer<typeof JSONZType>,
  depth: number
): Promise<CreateBlockResponseSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/version/${versionId}/block/${blockId}`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({ props, depth }),
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
