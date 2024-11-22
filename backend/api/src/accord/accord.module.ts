import { Module } from '@nestjs/common';
import { AccordController } from './accord.controller';
import { AccordService } from './accord.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [AccordController],
  providers: [AccordService],
  imports: [PrismaModule],
})
export class AccordModule {}
