import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalRoutes,
      totalBookings,
      totalRevenue,
      recentBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.route.count({ where: { isActive: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        _sum: { totalAmount: true },
      }),
      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          route: {
            select: { from: true, to: true },
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalRoutes,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentBookings,
    };
  }
}
