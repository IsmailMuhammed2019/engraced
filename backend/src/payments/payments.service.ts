import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initializePayment(bookingId: string, amount: number, email: string) {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        route: true,
        trip: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Generate unique reference
    const reference = `ENG_${bookingId}_${Date.now()}`;

    try {
      // Initialize payment with Paystack
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Paystack expects amount in kobo
          reference,
          callback_url: `${this.configService.get('FRONTEND_URL')}/booking/success`,
          metadata: {
            bookingId,
            bookingNumber: booking.bookingNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          bookingId,
          amount,
          paystackRef: reference,
          paymentStatus: 'PENDING',
        },
      });

      return {
        payment,
        authorizationUrl: response.data.data.authorization_url,
        reference,
      };
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      throw new Error('Failed to initialize payment');
    }
  }

  async verifyPayment(reference: string) {
    try {
      // Verify payment with Paystack
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      const paymentData = response.data.data;

      // Update payment record
      const payment = await this.prisma.payment.update({
        where: { paystackRef: reference },
        data: {
          paymentStatus: paymentData.status === 'success' ? 'PAID' : 'FAILED',
          paymentDate: new Date(),
          paymentMethod: paymentData.channel,
          failureReason: paymentData.status === 'failed' ? paymentData.gateway_response : null,
        },
        include: {
          booking: {
            include: {
              user: true,
              route: true,
              trip: true,
            },
          },
        },
      });

      // Update booking status if payment successful
      if (paymentData.status === 'success') {
        await this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        });

        // Create notification for user
        if (payment.booking.userId) {
          await this.prisma.notification.create({
            data: {
              userId: payment.booking.userId,
              type: 'PAYMENT_SUCCESS',
              title: 'Payment Successful',
              message: `Your payment for booking ${payment.booking.bookingNumber} has been confirmed.`,
              data: {
                bookingId: payment.booking.id,
                amount: payment.amount,
              },
            },
          });
        }
      }

      return {
        payment,
        success: paymentData.status === 'success',
        message: paymentData.status === 'success' ? 'Payment successful' : 'Payment failed',
      };
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error('Failed to verify payment');
    }
  }

  async getPaymentByBookingId(bookingId: string) {
    return this.prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            user: true,
            route: true,
            trip: true,
          },
        },
      },
    });
  }

  async getAllPayments() {
    return this.prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            route: {
              select: {
                from: true,
                to: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPaymentStats() {
    const [
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({
        where: { paymentStatus: 'PAID' },
      }),
      this.prisma.payment.count({
        where: { paymentStatus: 'FAILED' },
      }),
      this.prisma.payment.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { amount: true },
      }),
    ]);

    const monthlyRevenue = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
      successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
      monthlyRevenue,
    };
  }
}
