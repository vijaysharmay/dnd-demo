import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeoffDto } from './create-timeoff.dto';

export class UpdateTimeoffDto extends PartialType(CreateTimeoffDto) {}
