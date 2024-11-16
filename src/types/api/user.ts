import { z } from "zod";

export const OwnerZSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
});

export const PageZSchema = z.object({
  id: z.string(),
  name: z.string(),
  route: z.string(),
  owner: OwnerZSchema,
});

export const ProjectZSchema = z.object({
  id: z.string(),
  name: z.string(),
  route: z.string(),
  pages: z.array(PageZSchema),
  owner: OwnerZSchema,
});

export const WorkspaceZSchema = z.object({
  id: z.string(),
  name: z.string(),
  isUserWorkspace: z.boolean(),
  route: z.nullable(z.string()),
  owner: OwnerZSchema,
  projects: z.array(ProjectZSchema),
});

export type WorkspaceSchema = z.infer<typeof WorkspaceZSchema>;
export type OwnerSchema = z.infer<typeof OwnerZSchema>;
export type PageSchema = z.infer<typeof PageZSchema>;
export type ProjectSchema = z.infer<typeof ProjectZSchema>;

export const CurrentUserZResponse = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  userWorkspace: WorkspaceZSchema,
  workspaces: z.array(
    z.object({
      role: z.string(),
      workspace: WorkspaceZSchema,
    })
  ),
});

export type CurrentUserResponse = z.infer<typeof CurrentUserZResponse>;
