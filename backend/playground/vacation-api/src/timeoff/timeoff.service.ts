import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TimeOffService {
  constructor(private readonly prisma: PrismaService) {}

  // Employee: Request time off
  async requestTimeOff(data: {
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new ForbiddenException('Invalid employee ID');
    }

    return this.prisma.timeOffRequest.create({
      data: {
        employeeId: data.employeeId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        departmentId: employee.departmentId,
      },
    });
  }

  // Employee: Check time-off status
  async getTimeOffStatus(employeeId: string) {
    return this.prisma.timeOffRequest.findMany({
      where: { employeeId },
      include: { department: true },
    });
  }

  // Manager/Admin: Approve or reject time-off requests
  async approveTimeOff(data: {
    requestId: string;
    status: 'APPROVED' | 'REJECTED';
  }) {
    return this.prisma.timeOffRequest.update({
      where: { id: data.requestId },
      data: { status: data.status },
    });
  }

  // Manager: Get all requests for their department
  async getDepartmentRequests(managerId: string) {
    const manager = await this.prisma.employee.findUnique({
      where: { id: managerId },
    });

    if (!manager || !manager.departmentId) {
      throw new ForbiddenException('Manager does not belong to a department.');
    }

    return this.prisma.timeOffRequest.findMany({
      where: { departmentId: manager.departmentId },
      include: { employee: true },
    });
  }

  // Admin: Add a new holiday
  async addHoliday(data: { date: string; description: string }) {
    return this.prisma.holiday.create({
      data: {
        date: new Date(data.date),
        description: data.description,
      },
    });
  }

  // Admin: Get analytics (by department, location, designation, gender)
  async getAnalytics(departmentId?: string) {
    const filters = departmentId ? { departmentId } : {};

    const timeOffCounts = await this.prisma.timeOffRequest.groupBy({
      by: ['status'],
      where: filters,
      _count: { status: true },
    });

    const genderStats = await this.prisma.employee.groupBy({
      by: ['gender'],
      where: filters,
      _count: { gender: true },
    });

    const locationStats = await this.prisma.employee.groupBy({
      by: ['location'],
      where: filters,
      _count: { location: true },
    });

    const designationStats = await this.prisma.employee.groupBy({
      by: ['designation'],
      where: filters,
      _count: { designation: true },
    });

    return { timeOffCounts, genderStats, locationStats, designationStats };
  }
}
