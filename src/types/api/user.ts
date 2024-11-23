import { z } from "zod";

export const OwnerZSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
});

export const PageWithoutRootZSchema = z.object({
  id: z.string(),
  name: z.string(),
  route: z.string(),
  owner: OwnerZSchema,
});

export const WorkspaceWithOutProjectsZSchema = z.object({
  id: z.string(),
  name: z.string(),
  isUserWorkspace: z.boolean(),
  route: z.nullable(z.string()),
  owner: OwnerZSchema,
});

export const ProjectWithoutPagesZSchema = z.object({
  id: z.string(),
  name: z.string(),
  route: z.string(),
  owner: OwnerZSchema,
});

export const ProjectZSchema = ProjectWithoutPagesZSchema.extend({
  pages: z.array(PageWithoutRootZSchema),
});

export const WorkspaceZSchema = WorkspaceWithOutProjectsZSchema.extend({
  projects: z.array(ProjectZSchema),
});

export type WorkspaceSchema = z.infer<typeof WorkspaceZSchema>;
export type OwnerSchema = z.infer<typeof OwnerZSchema>;
export type PageSchema = z.infer<typeof PageWithoutRootZSchema>;
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
