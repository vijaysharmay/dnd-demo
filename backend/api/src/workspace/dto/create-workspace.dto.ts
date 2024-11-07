import { createZodDto } from 'nestjs-zod';
import { ROLES } from 'src/utils/types';
import { z } from 'zod';

const memberRoleZSchema = z.object({
  memberId: z.string(),
  role: z.enum(ROLES),
});

const workspaceWithOutMembersAndProjectsSchema = z.object({
  name: z.string().max(100),
  ownerId: z.string(),
  route: z.string(),
  members: z.optional(z.array(memberRoleZSchema)),
});

export class CreateWorkspaceDto extends createZodDto(
  workspaceWithOutMembersAndProjectsSchema,
) {}
