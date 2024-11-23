import { createZodDto } from 'nestjs-zod';
import { JSONZType } from 'src/utils/types';
import { z } from 'zod';

export const blockZSchema = z.object({
  blockUniqId: z.string(),
  blockType: z.enum(['Input', 'Button', 'HContainer', 'DTable']),
  props: JSONZType,
  depth: z.number(),
  position: z.number(),
});

export const removeChildrenZSchema = z.array(
  z.object({
    id: z.string(),
  }),
);

export class CreateBlockDto extends createZodDto(blockZSchema) {}
export class RemoveChildrenDto extends createZodDto(removeChildrenZSchema) {}
