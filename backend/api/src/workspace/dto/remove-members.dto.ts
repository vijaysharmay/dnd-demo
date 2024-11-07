import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const removeMembersZSchema = z.object({
  members: z.array(z.string()),
});
export class RemoveMembersDto extends createZodDto(removeMembersZSchema) {}
