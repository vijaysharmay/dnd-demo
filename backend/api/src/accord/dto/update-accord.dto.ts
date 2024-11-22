import { PartialType } from '@nestjs/mapped-types';
import { CreateAccordDto } from './create-accord.dto';

export class UpdateAccordDto extends PartialType(CreateAccordDto) {}
