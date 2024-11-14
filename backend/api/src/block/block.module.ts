import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

import { BlockController } from './block.controller';
import { BlockService } from './block.service';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [PrismaModule],
})
export class BlockModule {}
