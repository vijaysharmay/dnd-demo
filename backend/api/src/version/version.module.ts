import { Module } from '@nestjs/common';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [VersionController],
  providers: [VersionService],
  imports: [PrismaModule]
})
export class VersionModule {}
