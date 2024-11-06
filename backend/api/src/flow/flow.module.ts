import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';

@Module({
  controllers: [FlowController],
  providers: [FlowService],
  imports: [PrismaModule],
})
export class FlowModule {}
