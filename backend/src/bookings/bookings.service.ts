import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Verify trip exists
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBookingDto.tripId },
      include: {
        seats: true,
        route: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Check seat availability
    const requestedSeats = createBookingDto.seatNumbers;
    const bookedSeats = trip.seats.filter(seat => 
      seat.isBooked && requestedSeats.includes(seat.seatNumber)
    );

    if (bookedSeats.length > 0) {
      throw new ConflictException('Some seats are already booked');
    }

    // Generate booking number
    const bookingNumber = `BK-${Date.now().toString().slice(-6)}`;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        bookingNumber,
        totalAmount: new Decimal(trip.price.toNumber() * createBookingDto.passengerCount),
      },
      include: {
        trip: {
          include: {
            route: true,
            driver: true,
            vehicle: true,
          },
        },
        user: true,
      },
    });

    // Update seat status
    await this.prisma.seat.updateMany({
      where: {
        tripId: createBookingDto.tripId,
        seatNumber: { in: requestedSeats },
      },
      data: {
        isBooked: true,
        bookingId: booking.id,
      },
    });

    return booking;
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        trip: {
          include: {
            route: true,
            driver: true,
            vehicle: true,
          },
        },
        user: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            route: true,
            driver: true,
            vehicle: true,
          },
        },
        user: true,
        payment: true,
        seats: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            route: true,
            driver: true,
            vehicle: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        trip: {
          include: {
            route: true,
            driver: true,
            vehicle: true,
          },
        },
        user: true,
        payment: true,
      },
    });
  }

  async remove(id: string) {
    const booking = await this.findOne(id);

    // Free up seats
    await this.prisma.seat.updateMany({
      where: {
        bookingId: id,
      },
      data: {
        isBooked: false,
        bookingId: null,
      },
    });

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  async getBookingStats() {
    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: { status: 'CONFIRMED' },
      }),
      this.prisma.booking.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.booking.count({
        where: { status: 'CANCELLED' },
      }),
      this.prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }
}
