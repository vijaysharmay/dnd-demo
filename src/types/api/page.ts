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
  children: BlockSchema[];
};

export const BlockZSchema: z.ZodType<BlockSchema> =
  BlockWithoutChildrenZSchema.extend({
    children: z.lazy(() => BlockZSchema.array()),
  });

export const VersionZSchema = VersionWithoutBlocksZSchema.extend({
  project: ProjectWithoutPagesZSchema,
  workspace: WorkspaceWithOutProjectsZSchema,
  page: PageWithoutRootZSchema,
  blocks: z.array(BlockZSchema),
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