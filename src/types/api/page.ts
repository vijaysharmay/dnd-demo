import { z } from "zod";
import { JSONZType } from "./common";
import {
  PageWithoutRootZSchema,
  ProjectWithoutPagesZSchema,
  UserZSchema,
  VersionWithoutBlocksZSchema,
  WorkspaceWithOutProjectsZSchema,
} from "./user";

export const BlockWithoutChildrenZSchema = z.object({
  id: z.string(),
  blockType: z.string(),
  props: JSONZType,
  depth: z.number(),
  position: z.number(),
  parentId: z.nullable(z.string()),
});

export type BlockSchema = z.infer<typeof BlockWithoutChildrenZSchema> & {
  children?: BlockSchema[];
};

export const BlockZSchema: z.ZodType<BlockSchema> =
  BlockWithoutChildrenZSchema.extend({
    children: z.lazy(() => BlockZSchema.array()).optional(),
  });

export const ChangeLogZSchema = z.object({
  changeOwner: UserZSchema,
  changesMadeOn: z.string(),
  id: z.string(),
  changeLog: z.string(),
  versionId: z.string(),
});

export const StatusLogZSchema = z.object({
  changeOwner: UserZSchema,
  changesMadeOn: z.string(),
  id: z.string(),
  status: z.string(),
  versionId: z.string(),
});

export const ReleaseZSchema = z.object({
  id: z.string(),
  releaseName: z.string(),
  releasedBy: UserZSchema,
  versionId: z.string(),
  releasedOn: z.string(),
});

export const VersionZSchema = VersionWithoutBlocksZSchema.extend({
  owner: UserZSchema,
  project: ProjectWithoutPagesZSchema,
  workspace: WorkspaceWithOutProjectsZSchema,
  page: PageWithoutRootZSchema,
  blocks: z.array(BlockZSchema),
  statusLog: z.array(StatusLogZSchema),
  changeLog: z.array(ChangeLogZSchema),
  releases: z.array(ReleaseZSchema),
});

export const PageZSchema = PageWithoutRootZSchema.extend({
  project: ProjectWithoutPagesZSchema,
  workspace: WorkspaceWithOutProjectsZSchema,
  versions: z.array(VersionZSchema),
});

export type PageSchema = z.infer<typeof PageZSchema>;
export type VersionSchema = z.infer<typeof VersionZSchema>;

export type Reviewer = {
  approver: z.infer<typeof UserZSchema>;
  comment: string | null;
  status: string;
};
