import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const accordZSchema = z.object({
  accordName: z.string(),
  accordType: z.enum(['OPENAPI', 'JSONSCHEMA']),
  accordSchema: z.string(),
  accordVersion: z.string(),
  accordAPIUrl: z.string(),
});

export class CreateAccordDto extends createZodDto(accordZSchema) {}
