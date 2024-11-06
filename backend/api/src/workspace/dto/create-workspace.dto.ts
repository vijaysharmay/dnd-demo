import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const workspaceWithOutMembersAndProjectsSchema = z.object({
  name: z.string().max(100),
  ownerId: z.string(),
  route: z.string(),
  members: z.optional(z.array(z.string())),
});

export class CreateWorkspaceDto extends createZodDto(
  workspaceWithOutMembersAndProjectsSchema,
) {}
