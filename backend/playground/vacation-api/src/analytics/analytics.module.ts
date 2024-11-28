import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [PrismaModule],
})
export class AnalyticsModule {}
