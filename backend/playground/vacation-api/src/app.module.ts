import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { TimeoffModule } from './timeoff/timeoff.module';

@Module({
  imports: [EmployeeModule, DepartmentModule, TimeoffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
