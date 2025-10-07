import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private promotionsService: PromotionsService,
  ) {}

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

    // Calculate base amount
    const baseAmount = trip.price.toNumber() * createBookingDto.passengerCount;
    let totalAmount = baseAmount;
    let discountAmount = 0;
    let promotionId = null;

    // Handle promotion if provided
    if (createBookingDto.promotionCode) {
      try {
        const promotion = await this.promotionsService.validatePromotion(
          createBookingDto.promotionCode,
          createBookingDto.userId,
          trip.routeId,
          baseAmount
        );
        
        const discount = await this.promotionsService.calculateDiscount(promotion, baseAmount);
        discountAmount = discount.discountAmount;
        totalAmount = discount.finalAmount;
        promotionId = promotion.id;
      } catch (error) {
        throw new ConflictException(`Promotion error: ${error.message}`);
      }
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        bookingNumber,
        totalAmount: new Decimal(totalAmount),
        discountAmount: new Decimal(discountAmount),
        promotionId,
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
        promotion: true,
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

    // Send booking confirmation email
    try {
      await this.emailService.sendBookingConfirmationEmail(
        booking.user.email,
        booking.user.firstName,
        {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          route: `${trip.route.from} to ${trip.route.to}`,
          date: trip.departureTime.toLocaleDateString(),
          time: trip.departureTime,
          passengers: createBookingDto.passengerCount,
          seats: requestedSeats.join(', '),
          amount: booking.totalAmount.toString(),
        }
      );
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      // Don't fail booking if email fails
    }

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

  async updateStatus(id: string, status: string, reason?: string) {
    const booking = await this.findOne(id);
    
    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: status.toUpperCase() as any,
        ...(reason && { cancellationReason: reason }),
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
        payment: true,
      },
    });

    // Send status update email
    try {
      await this.emailService.sendBookingStatusUpdateEmail(
        booking.user.email,
        booking.user.firstName,
        {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          route: `${booking.trip.route.from} to ${booking.trip.route.to}`,
          date: booking.trip.departureTime.toLocaleDateString(),
          time: booking.trip.departureTime,
          status: status.toUpperCase(),
          reason: reason,
          amount: booking.totalAmount.toString(),
        }
      );
    } catch (error) {
      console.error('Failed to send status update email:', error);
      // Don't fail status update if email fails
    }

    return updatedBooking;
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

  async delete(id: string) {
    const booking = await this.findOne(id);

    // Check if booking has payment
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId: id },
    });

    if (payment && payment.paymentStatus === 'PAID') {
      throw new Error('Cannot delete booking with successful payment. Cancel the booking instead.');
    }

    // Delete payment if exists
    if (payment) {
      await this.prisma.payment.delete({
        where: { bookingId: id },
      });
    }

    // Free up and delete seats
    await this.prisma.seat.deleteMany({
      where: { bookingId: id },
    });

    // Delete the booking permanently
    return this.prisma.booking.delete({
      where: { id },
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
