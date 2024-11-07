import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const projectZSchema = z.object({
  name: z.string().max(100),
  ownerId: z.string(),
  route: z.string(),
});

export class CreateProjectDto extends createZodDto(projectZSchema) {}
