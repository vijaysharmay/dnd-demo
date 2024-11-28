import { Module } from '@nestjs/common';
import { TimeoffService } from './timeoff.service';
import { TimeoffController } from './timeoff.controller';

@Module({
  controllers: [TimeoffController],
  providers: [TimeoffService],
})
export class TimeoffModule {}
