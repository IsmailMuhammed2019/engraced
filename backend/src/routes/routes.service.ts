import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  async create(createRouteDto: CreateRouteDto, adminId: string) {
    return this.prisma.route.create({
      data: {
        ...createRouteDto,
        adminId,
      },
      include: {
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        trips: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            departureTime: 'asc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.route.findMany({
      where: {
        isActive: true,
      },
      include: {
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        trips: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            departureTime: 'asc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        trips: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            departureTime: 'asc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async findByCities(from: string, to: string) {
    return this.prisma.route.findFirst({
      where: {
        from: {
          equals: from,
          mode: 'insensitive',
        },
        to: {
          equals: to,
          mode: 'insensitive',
        },
        isActive: true,
      },
      include: {
        trips: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            departureTime: 'asc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.findOne(id);
    
    return this.prisma.route.update({
      where: { id },
      data: updateRouteDto,
      include: {
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        trips: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            departureTime: 'asc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const route = await this.findOne(id);
    
    return this.prisma.route.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async delete(id: string) {
    const route = await this.findOne(id);
    
    // Check if route has trips
    const tripsCount = await this.prisma.trip.count({
      where: { routeId: id },
    });

    if (tripsCount > 0) {
      throw new Error('Cannot delete route with existing trips. Deactivate the route instead.');
    }

    // Delete the route permanently
    return this.prisma.route.delete({
      where: { id },
    });
  }

  async getRouteStats(id: string) {
    const route = await this.findOne(id);
    
    const stats = await this.prisma.booking.aggregate({
      where: {
        routeId: id,
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    const monthlyStats = await this.prisma.booking.groupBy({
      by: ['createdAt'],
      where: {
        routeId: id,
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      route,
      stats: {
        totalBookings: stats._count.id,
        totalRevenue: stats._sum.totalAmount || 0,
      },
      monthlyStats,
    };
  }
}
