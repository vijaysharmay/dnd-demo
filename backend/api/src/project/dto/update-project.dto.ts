import { PartialType } from '@nestjs/mapped-types';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
export class UpdateWorkspaceDto extends createZodDto(
  z.object({ newWorkspaceId: z.string() }),
) {}
