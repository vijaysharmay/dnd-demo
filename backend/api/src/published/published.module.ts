import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

import { PublishedController } from './published.controller';
import { PublishedService } from './published.service';

@Module({
  controllers: [PublishedController],
  providers: [PublishedService],
  imports: [PrismaModule],
})
export class PublishedModule {}
