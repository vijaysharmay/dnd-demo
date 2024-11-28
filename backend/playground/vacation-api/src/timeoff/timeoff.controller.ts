import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TimeOffService } from './timeoff.service';

@Controller('timeoff')
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  // Employee actions
  @Post('request')
  @Roles('EMPLOYEE')
  @UseGuards(RolesGuard)
  async requestTimeOff(@Body() requestDto: any) {
    return this.timeOffService.requestTimeOff(requestDto);
  }

  @Get('status/:employeeId')
  @Roles('EMPLOYEE')
  @UseGuards(RolesGuard)
  async getTimeOffStatus(@Param('employeeId') employeeId: string) {
    return this.timeOffService.getTimeOffStatus(employeeId);
  }

  // Manager and admin actions
  @Patch('approve')
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  async approveTimeOff(@Body() approvalDto: any) {
    return this.timeOffService.approveTimeOff(approvalDto);
  }

  @Get('department/requests/:managerId')
  @Roles('MANAGER')
  @UseGuards(RolesGuard)
  async getDepartmentRequests(@Param('managerId') managerId: string) {
    return this.timeOffService.getDepartmentRequests(managerId);
  }

  // Admin-only actions
  @Post('holidays')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async addHoliday(@Body() holidayDto: any) {
    return this.timeOffService.addHoliday(holidayDto);
  }
}
