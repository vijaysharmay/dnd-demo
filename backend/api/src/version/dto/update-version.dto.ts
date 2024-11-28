import { PageVersionStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

// Assuming Prisma exports this

export class UpdateVersionDto {
  @IsOptional()
  @IsEnum(PageVersionStatus) // Ensure valid enum values
  currentStatus?: PageVersionStatus;

  @IsOptional()
  @IsString()
  name?: string;
}

export class CloneVersionDto {
  @IsString()
  versionName: string;
}

export class AddReviewersDto {
  @IsString()
  reviewers: string[];
}

export class PublishDto {
  @IsString()
  releaseName: string;
}
