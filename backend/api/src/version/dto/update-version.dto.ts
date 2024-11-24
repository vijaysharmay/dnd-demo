import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageVersionStatus } from '@prisma/client'; // Assuming Prisma exports this

export class UpdateVersionDto {
  @IsOptional()
  @IsEnum(PageVersionStatus) // Ensure valid enum values
  currentStatus?: PageVersionStatus;

  @IsOptional()
  @IsString()
  name?: string;
}
