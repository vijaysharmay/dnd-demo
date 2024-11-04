import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const workspaceSchema = z.object({
  name: z.string().max(100),
  ownerId: z.string(),
  route: z.string(),
});

export class CreateWorkspaceDto extends createZodDto(workspaceSchema) {}
