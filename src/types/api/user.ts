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

export const VersionWithoutBlocksZSchema = z.object({
  id: z.string(),
  name: z.string(),
  currentStatus: z.string(),
});

export const SidebarPageZSchema = PageWithoutRootZSchema.extend({
  versions: z.array(VersionWithoutBlocksZSchema),
});

export const SidebarProjectZSchema = ProjectWithoutPagesZSchema.extend({
  pages: z.array(SidebarPageZSchema),
});

export const SidebarWorkspaceZSchema = WorkspaceWithOutProjectsZSchema.extend({
  projects: z.array(SidebarProjectZSchema),
});

export type SidebarWorkspaceSchema = z.infer<typeof SidebarWorkspaceZSchema>;
export type OwnerSchema = z.infer<typeof OwnerZSchema>;
export type SidebarPageSchema = z.infer<typeof SidebarPageZSchema>;
export type SidebarProjectSchema = z.infer<typeof SidebarProjectZSchema>;
export type SidebarVersionSchema = z.infer<typeof VersionWithoutBlocksZSchema>;

export const CurrentUserZResponse = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  userWorkspace: SidebarWorkspaceZSchema,
  workspaces: z.array(
    z.object({
      role: z.string(),
      workspace: SidebarWorkspaceZSchema,
    })
  ),
});

export type CurrentUserResponse = z.infer<typeof CurrentUserZResponse>;
