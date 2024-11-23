import { z } from "zod";
import {
  PageWithoutRootZSchema,
  ProjectWithoutPagesZSchema,
  WorkspaceWithOutProjectsZSchema,
} from "./user";

export const BlockWithoutChildrenZSchema = z.object({
  id: z.string(),
  blockUniqId: z.string(),
  blockType: z.string(),
  props: z.object({}),
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

export const PageZSchema = PageWithoutRootZSchema.extend({
  project: ProjectWithoutPagesZSchema,
  workspace: WorkspaceWithOutProjectsZSchema,
  rootId: z.string(),
  root: BlockZSchema,
});
