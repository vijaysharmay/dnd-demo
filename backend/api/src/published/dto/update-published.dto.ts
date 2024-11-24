import { PartialType } from '@nestjs/mapped-types';
import { CreatePublishedDto } from './create-published.dto';

export class UpdatePublishedDto extends PartialType(CreatePublishedDto) {}
