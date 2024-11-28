import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TimeOffController } from './timeoff.controller';
import { TimeOffService } from './timeoff.service';

@Module({
  controllers: [TimeOffController],
  providers: [TimeOffService],
  imports: [PrismaModule],
})
export class TimeoffModule {}
