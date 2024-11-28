import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [PrismaModule],
})
export class DepartmentModule {}
