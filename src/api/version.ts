import { VersionZSchema } from "@/types/api/page";
import { z } from "zod";

type VersionSchema = z.infer<typeof VersionZSchema>;

export const getPageVersionInProjectWorkspace = async (
  workspaceId: string,
  projecctId: string,
  pageId: string,
  versionId: string
): Promise<VersionSchema> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projecctId}/page/${pageId}/version/${versionId}`;
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
  const result = VersionZSchema.safeParse(data);

  // console.log(result.error, data);
  if (!result.success) {
    throw new Error("Error fetching version - response schema mismatch");
  }

  return result.data;
};

export const deleteVersionInProjectWorkspace = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}`;
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

export const cloneVersionInProjectWorkspace = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string,
  versionName: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}/clone`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({ versionName }),
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

export const setReviewersToUnpublishedVersion = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string,
  reviewers: string[]
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}/reviewers`;
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({ reviewers }),
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

export const getExistingReviewersForVersion = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string,
  versionStatusLogId: string
) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}/reviewers?versionStatusLogId=${versionStatusLogId}`;
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

  return data.approvers;
};

export const approveUnpublishedVersion = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}/approve`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({}),
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

export const rejectUnpublishedVersion = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}/reject`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({}),
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

export const publishUnpublishedVersion = async (
  workspaceId: string,
  projectId: string,
  pageId: string,
  versionId: string,
  releaseName: string
): Promise<boolean> => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/workspace/${workspaceId}/project/${projectId}/page/${pageId}/version/${versionId}/publish`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({ releaseName }),
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
