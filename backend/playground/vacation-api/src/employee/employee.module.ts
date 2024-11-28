import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [PrismaModule],
})
export class EmployeeModule {}
