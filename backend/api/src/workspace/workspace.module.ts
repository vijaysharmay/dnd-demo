import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [PrismaModule],
})
export class WorkspaceModule {}
