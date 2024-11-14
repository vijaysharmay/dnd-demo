import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email(),
  passwd: z.string(),
});

export class AuthUserDto extends createZodDto(authSchema) {}
