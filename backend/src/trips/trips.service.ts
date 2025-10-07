import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(createTripDto: CreateTripDto) {
    // Verify route exists
    const route = await this.prisma.route.findUnique({
      where: { id: createTripDto.routeId },
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    // Verify driver exists and is active
    const driver = await this.prisma.driver.findUnique({
      where: { id: createTripDto.driverId },
    });

    if (!driver || !driver.isActive) {
      throw new NotFoundException('Driver not found or inactive');
    }

    // Verify vehicle exists and is active
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: createTripDto.vehicleId },
    });

    if (!vehicle || !vehicle.isActive) {
      throw new NotFoundException('Vehicle not found or inactive');
    }

    // Create the trip
    const trip = await this.prisma.trip.create({
      data: {
        routeId: createTripDto.routeId,
        driverId: createTripDto.driverId,
        vehicleId: createTripDto.vehicleId,
        departureTime: new Date(createTripDto.departureTime),
        arrivalTime: new Date(createTripDto.arrivalTime),
        price: createTripDto.price,
        maxPassengers: createTripDto.maxPassengers || 7,
        status: (createTripDto.status as TripStatus) || TripStatus.ACTIVE,
        features: createTripDto.features || [],
        amenities: createTripDto.amenities || [],
      },
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
          },
        },
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            rating: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            make: true,
            model: true,
            features: true,
            capacity: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            seats: true,
          },
        },
      },
    });

    // Create seats for the trip (Sienna: 1 front + 6 back = 7 seats)
    const seatNumbers = ['A1']; // Front seat
    for (let i = 1; i <= 6; i++) {
      seatNumbers.push(`B${i}`); // Back seats
    }

    await this.prisma.seat.createMany({
      data: seatNumbers.map(seatNumber => ({
        tripId: trip.id,
        seatNumber,
        isBooked: false,
      })),
    });

    return trip;
  }

  async findAll(routeId?: string, from?: string, to?: string, date?: string) {
    const where: any = {
      status: 'ACTIVE',
    };

    if (routeId) {
      where.routeId = routeId;
    }

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      where.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return this.prisma.trip.findMany({
      where,
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  async searchTrips(from: string, to: string, date: string, passengers: number = 1) {
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    return this.prisma.trip.findMany({
      where: {
        status: 'ACTIVE',
        departureTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        route: {
          from: {
            contains: from,
            mode: 'insensitive',
          },
          to: {
            contains: to,
            mode: 'insensitive',
          },
        },
        maxPassengers: {
          gte: passengers,
        },
      },
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
            basePrice: true,
          },
        },
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            make: true,
            model: true,
            capacity: true,
            features: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  async findByRoute(routeId: string) {
    return this.prisma.trip.findMany({
      where: {
        routeId,
        status: 'ACTIVE',
      },
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  async findByDate(date: string) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.prisma.trip.findMany({
      where: {
        departureTime: {
          gte: startDate,
          lt: endDate,
        },
        status: 'ACTIVE',
      },
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    const trip = await this.findOne(id);
    
    return this.prisma.trip.update({
      where: { id },
      data: {
        ...(updateTripDto.departureTime && { 
          departureTime: new Date(updateTripDto.departureTime) 
        }),
        ...(updateTripDto.arrivalTime && { 
          arrivalTime: new Date(updateTripDto.arrivalTime) 
        }),
        ...(updateTripDto.price && { price: updateTripDto.price }),
        ...(updateTripDto.maxPassengers && { maxPassengers: updateTripDto.maxPassengers }),
        ...(updateTripDto.status && { status: updateTripDto.status as TripStatus }),
        ...(updateTripDto.features && { features: updateTripDto.features }),
        ...(updateTripDto.amenities && { amenities: updateTripDto.amenities }),
      },
      include: {
        route: {
          select: {
            id: true,
            from: true,
            to: true,
            distance: true,
            duration: true,
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
    const trip = await this.findOne(id);
    
    return this.prisma.trip.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  async delete(id: string) {
    const trip = await this.findOne(id);
    
    // Check if trip has bookings
    const bookingsCount = await this.prisma.booking.count({
      where: { tripId: id },
    });

    if (bookingsCount > 0) {
      throw new Error('Cannot delete trip with existing bookings. Cancel the trip instead.');
    }

    // Delete the trip permanently
    return this.prisma.trip.delete({
      where: { id },
    });
  }

  async getAvailableSeats(tripId: string) {
    const trip = await this.findOne(tripId);
    
    const bookedSeats = await this.prisma.booking.findMany({
      where: {
        tripId,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
      select: {
        seatNumbers: true,
      },
    });

    const allBookedSeats = bookedSeats.flatMap(booking => booking.seatNumbers);
    const totalSeats = trip.maxPassengers;
    
    // Generate seat numbers (A1, A2, B1, B2, etc.)
    const allSeats = [];
    const rows = Math.ceil(totalSeats / 4);
    
    for (let row = 0; row < rows; row++) {
      for (let seat = 1; seat <= 4; seat++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${seat}`;
        allSeats.push(seatNumber);
      }
    }

    const availableSeats = allSeats.filter(seat => !allBookedSeats.includes(seat));
    
    return {
      trip,
      totalSeats,
      bookedSeats: allBookedSeats,
      availableSeats,
      availableCount: availableSeats.length,
    };
  }
}
