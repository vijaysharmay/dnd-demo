import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // Analytics with time-based metrics
  async getAnalytics(
    departmentId?: string,
    startDate?: string,
    endDate?: string,
    interval: 'day' | 'week' | 'month' = 'month',
  ) {
    const filters: any = {};
    if (departmentId) {
      filters.departmentId = departmentId;
    }

    if (startDate && endDate) {
      filters.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const timeOffTrends = await this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC(${interval}, "createdAt") as period,
        "status",
        COUNT(*) as count
      FROM "TimeOffRequest"
      WHERE "createdAt" BETWEEN ${filters.createdAt?.gte || '1970-01-01'} AND ${filters.createdAt?.lte || '9999-12-31'}
      GROUP BY period, "status"
      ORDER BY period;
    `;

    const genderTrends = await this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC(${interval}, "createdAt") as period,
        "gender",
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" BETWEEN ${filters.createdAt?.gte || '1970-01-01'} AND ${filters.createdAt?.lte || '9999-12-31'}
      GROUP BY period, "gender"
      ORDER BY period;
    `;

    const locationTrends = await this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC(${interval}, "createdAt") as period,
        "location",
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" BETWEEN ${filters.createdAt?.gte || '1970-01-01'} AND ${filters.createdAt?.lte || '9999-12-31'}
      GROUP BY period, "location"
      ORDER BY period;
    `;

    const designationTrends = await this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC(${interval}, "createdAt") as period,
        "designation",
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" BETWEEN ${filters.createdAt?.gte || '1970-01-01'} AND ${filters.createdAt?.lte || '9999-12-31'}
      GROUP BY period, "designation"
      ORDER BY period;
    `;

    return {
      timeOffTrends,
      genderTrends,
      locationTrends,
      designationTrends,
    };
  }
}
