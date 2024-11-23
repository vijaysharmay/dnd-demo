import { z } from "zod";
import { JSONZType } from "./common";
import {
  PageWithoutRootZSchema,
  ProjectWithoutPagesZSchema,
  WorkspaceWithOutProjectsZSchema,
} from "./user";

export const BlockWithoutChildrenZSchema = z.object({
  id: z.string(),
  blockType: z.string(),
  props: JSONZType,
  depth: z.number(),
  position: z.number(),
  parentId: z.nullable(z.string()),
  workspaceId: z.string(),
  projectId: z.string(),
  pageId: z.string(),
});

export type BlockSchema = z.infer<typeof BlockWithoutChildrenZSchema> & {
  children: BlockSchema[];
};

export const BlockZSchema: z.ZodType<BlockSchema> =
  BlockWithoutChildrenZSchema.extend({
    children: z.lazy(() => BlockZSchema.array()),
  });

export const PageZSchema = PageWithoutRootZSchema.extend({
  project: ProjectWithoutPagesZSchema,
  workspace: WorkspaceWithOutProjectsZSchema,
  blocks: z.array(BlockZSchema),
});
