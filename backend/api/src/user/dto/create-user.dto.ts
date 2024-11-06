import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const userSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  passwd: z.string(),
  role: z.enum(['ADMIN', 'DESIGNER', 'DEVELOPER', 'OWNER']),
});

export class CreateUserDto extends createZodDto(userSchema) {}
