import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const accordZSchema = z.object({
  accordName: z.string(),
  accordSchema: z.string(),
  accordVersion: z.string(),
  accordAPIUrl: z.optional(z.string()),
  accordAPIUrlMethod: z.optional(z.string()),
});

export class CreateAccordDto extends createZodDto(accordZSchema) {}
