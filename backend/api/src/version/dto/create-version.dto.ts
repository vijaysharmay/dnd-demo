import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const verionZSchema = z.object({
  name: z.string().max(100),
  currentStatus: z.string(),
});

export class CreateVersionDto extends createZodDto(verionZSchema) {}
