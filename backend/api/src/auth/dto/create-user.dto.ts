import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const userSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  passwd: z.string(),
});

export class CreateUserDto extends createZodDto(userSchema) {}
