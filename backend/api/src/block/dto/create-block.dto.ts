import { createZodDto } from 'nestjs-zod';
import { JSONZType } from 'src/utils/types';
import { z } from 'zod';

export const blockZSchema = z.object({
  blockUniqId: z.string(),
  blockType: z.enum(['Input', 'Button', 'HContainer', 'DTable']),
  props: JSONZType,
});

export class CreateBlockDto extends createZodDto(blockZSchema) {}
