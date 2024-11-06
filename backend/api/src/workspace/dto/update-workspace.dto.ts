import { PartialType } from '@nestjs/mapped-types';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateWorkspaceDto } from './create-workspace.dto';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}

const updateMembersInWorkspaceSchema = z.object({
  members: z.array(z.string()),
});
export class UpdateMembersInWorkspaceDto extends createZodDto(
  updateMembersInWorkspaceSchema,
) {}
