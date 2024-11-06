import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService],
  imports: [PrismaModule],
})
export class ActionModule {}
