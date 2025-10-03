import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    // Check if email already exists
    const existingDriver = await this.prisma.driver.findUnique({
      where: { email: createDriverDto.email },
    });

    if (existingDriver) {
      throw new ConflictException('Driver with this email already exists');
    }

    // Check if license number already exists
    const existingLicense = await this.prisma.driver.findUnique({
      where: { licenseNumber: createDriverDto.licenseNumber },
    });

    if (existingLicense) {
      throw new ConflictException('Driver with this license number already exists');
    }

    return this.prisma.driver.create({
      data: {
        ...createDriverDto,
        licenseExpiry: new Date(createDriverDto.licenseExpiry),
      },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.driver.findMany({
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActive() {
    return this.prisma.driver.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        trips: {
          include: {
            route: {
              select: {
                from: true,
                to: true,
              },
            },
            vehicle: {
              select: {
                plateNumber: true,
                make: true,
                model: true,
              },
            },
          },
          orderBy: {
            departureTime: 'desc',
          },
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.findOne(id);

    // Check if email is being updated and if it conflicts
    if (updateDriverDto.email && updateDriverDto.email !== driver.email) {
      const existingDriver = await this.prisma.driver.findUnique({
        where: { email: updateDriverDto.email },
      });

      if (existingDriver) {
        throw new ConflictException('Driver with this email already exists');
      }
    }

    // Check if license number is being updated and if it conflicts
    if (updateDriverDto.licenseNumber && updateDriverDto.licenseNumber !== driver.licenseNumber) {
      const existingLicense = await this.prisma.driver.findUnique({
        where: { licenseNumber: updateDriverDto.licenseNumber },
      });

      if (existingLicense) {
        throw new ConflictException('Driver with this license number already exists');
      }
    }

    return this.prisma.driver.update({
      where: { id },
      data: {
        ...updateDriverDto,
        ...(updateDriverDto.licenseExpiry && {
          licenseExpiry: new Date(updateDriverDto.licenseExpiry),
        }),
      },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const driver = await this.findOne(id);

    // Check if driver has any active trips
    const activeTrips = await this.prisma.trip.count({
      where: {
        driverId: id,
        status: 'ACTIVE',
        departureTime: {
          gte: new Date(),
        },
      },
    });

    if (activeTrips > 0) {
      throw new ConflictException('Cannot deactivate driver with active trips');
    }

    return this.prisma.driver.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async getDriverStats(id: string) {
    const driver = await this.findOne(id);

    const stats = await this.prisma.trip.aggregate({
      where: {
        driverId: id,
      },
      _count: {
        id: true,
      },
    });

    const completedTrips = await this.prisma.trip.count({
      where: {
        driverId: id,
        status: 'COMPLETED',
      },
    });

    const upcomingTrips = await this.prisma.trip.count({
      where: {
        driverId: id,
        status: 'ACTIVE',
        departureTime: {
          gte: new Date(),
        },
      },
    });

    return {
      driver,
      stats: {
        totalTrips: stats._count.id,
        completedTrips,
        upcomingTrips,
      },
    };
  }
}
