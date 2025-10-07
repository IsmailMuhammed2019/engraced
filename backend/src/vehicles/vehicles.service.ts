import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    // Check if plate number already exists
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { plateNumber: createVehicleDto.plateNumber },
    });

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this plate number already exists');
    }

    return this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        ...(createVehicleDto.lastService && {
          lastService: new Date(createVehicleDto.lastService),
        }),
        ...(createVehicleDto.nextService && {
          nextService: new Date(createVehicleDto.nextService),
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

  async findAll() {
    return this.prisma.vehicle.findMany({
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
    return this.prisma.vehicle.findMany({
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
        plateNumber: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
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
            driver: {
              select: {
                firstName: true,
                lastName: true,
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

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    // Check if plate number is being updated and if it conflicts
    if (updateVehicleDto.plateNumber && updateVehicleDto.plateNumber !== vehicle.plateNumber) {
      const existingVehicle = await this.prisma.vehicle.findUnique({
        where: { plateNumber: updateVehicleDto.plateNumber },
      });

      if (existingVehicle) {
        throw new ConflictException('Vehicle with this plate number already exists');
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...updateVehicleDto,
        ...(updateVehicleDto.lastService && {
          lastService: new Date(updateVehicleDto.lastService),
        }),
        ...(updateVehicleDto.nextService && {
          nextService: new Date(updateVehicleDto.nextService),
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
    const vehicle = await this.findOne(id);

    // Check if vehicle has any active trips
    const activeTrips = await this.prisma.trip.count({
      where: {
        vehicleId: id,
        status: 'ACTIVE',
        departureTime: {
          gte: new Date(),
        },
      },
    });

    if (activeTrips > 0) {
      throw new ConflictException('Cannot deactivate vehicle with active trips');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async delete(id: string) {
    const vehicle = await this.findOne(id);

    // Check if vehicle has any trips (active or completed)
    const tripsCount = await this.prisma.trip.count({
      where: {
        vehicleId: id,
      },
    });

    if (tripsCount > 0) {
      throw new ConflictException('Cannot delete vehicle with associated trips');
    }

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async getVehicleStats(id: string) {
    const vehicle = await this.findOne(id);

    const stats = await this.prisma.trip.aggregate({
      where: {
        vehicleId: id,
      },
      _count: {
        id: true,
      },
    });

    const completedTrips = await this.prisma.trip.count({
      where: {
        vehicleId: id,
        status: 'COMPLETED',
      },
    });

    const upcomingTrips = await this.prisma.trip.count({
      where: {
        vehicleId: id,
        status: 'ACTIVE',
        departureTime: {
          gte: new Date(),
        },
      },
    });

    return {
      vehicle,
      stats: {
        totalTrips: stats._count.id,
        completedTrips,
        upcomingTrips,
      },
    };
  }

  async getAvailableVehicles(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get vehicles that have trips in the specified time range
    const busyVehicles = await this.prisma.trip.findMany({
      where: {
        departureTime: {
          gte: start,
          lte: end,
        },
        status: 'ACTIVE',
      },
      select: {
        vehicleId: true,
      },
      distinct: ['vehicleId'],
    });

    const busyVehicleIds = busyVehicles.map(trip => trip.vehicleId);

    // Get all active vehicles that are not busy
    return this.prisma.vehicle.findMany({
      where: {
        isActive: true,
        id: {
          notIn: busyVehicleIds,
        },
      },
      orderBy: {
        plateNumber: 'asc',
      },
    });
  }

  async addImages(vehicleId: string, imageUrls: string[]) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    console.log('Current vehicle images:', vehicle.images);
    console.log('Current vehicle images length:', vehicle.images.length);
    console.log('New image URLs to add:', imageUrls);
    console.log('New image URLs length:', imageUrls.length);

    // Add new images to existing ones
    const updatedImages = [...vehicle.images, ...imageUrls];
    console.log('Combined images:', updatedImages);
    console.log('Combined images length:', updatedImages.length);

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { images: updatedImages },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });
  }

  async removeImage(vehicleId: string, imageIndex: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (imageIndex < 0 || imageIndex >= vehicle.images.length) {
      throw new NotFoundException('Image index out of range');
    }

    // Remove image at the specified index
    const updatedImages = vehicle.images.filter((_, index) => index !== imageIndex);

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { images: updatedImages },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });
  }
}
