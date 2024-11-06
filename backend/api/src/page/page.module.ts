import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  controllers: [PageController],
  providers: [PageService],
  imports: [PrismaModule],
})
export class PageModule {}
