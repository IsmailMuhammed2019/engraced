import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
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
          callback_url: 'https://engracedsmile.com/api/payments/verify',
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

        // Send payment confirmation email
        try {
          await this.emailService.sendBookingConfirmationEmail(
            payment.booking.user.email,
            payment.booking.user.firstName,
            {
              bookingId: payment.booking.id,
              bookingNumber: payment.booking.bookingNumber,
              route: `${payment.booking.route.from} to ${payment.booking.route.to}`,
              date: payment.booking.trip.departureTime.toLocaleDateString(),
              time: payment.booking.trip.departureTime,
              passengers: payment.booking.passengerCount,
              seats: payment.booking.seatNumbers.join(', '),
              amount: payment.amount.toString(),
            }
          );
        } catch (error) {
          console.error('Failed to send payment confirmation email:', error);
          // Don't fail payment if email fails
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

  async getPaymentsByUserId(userId: string) {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          booking: {
            userId: userId,
          },
        },
        include: {
          booking: {
            include: {
              route: {
                select: {
                  from: true,
                  to: true,
                },
              },
              trip: {
                select: {
                  departureTime: true,
                  arrivalTime: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return payments;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      return [];
    }
  }

  async getAllPayments() {
    try {
      // First, try to get payments from local database
      const localPayments = await this.prisma.payment.findMany({
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

      // If we have local payments, return them
      if (localPayments.length > 0) {
        return localPayments;
      }

      // If no local payments, try to fetch from Paystack
      console.log('No local payments found, fetching from Paystack...');
      return await this.fetchPaymentsFromPaystack();
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Fallback to local database
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
  }

  async fetchPaymentsFromPaystack() {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const paystackTransactions = response.data.data;
      console.log(`Fetched ${paystackTransactions.length} transactions from Paystack`);

      // Transform Paystack data to match our local schema
      const transformedPayments = paystackTransactions.map((transaction: any) => ({
        id: transaction.id,
        amount: transaction.amount / 100, // Convert from kobo to naira
        paymentStatus: this.mapPaystackStatus(transaction.status),
        paymentMethod: transaction.channel || 'card',
        paystackRef: transaction.reference,
        createdAt: transaction.created_at,
        booking: {
          id: transaction.metadata?.bookingId || 'unknown',
          user: {
            firstName: transaction.customer?.first_name || 'Unknown',
            lastName: transaction.customer?.last_name || 'Customer',
            email: transaction.customer?.email || transaction.email || 'unknown@example.com',
          },
          route: {
            from: transaction.metadata?.from || 'Unknown',
            to: transaction.metadata?.to || 'Unknown',
          },
        },
      }));

      return transformedPayments;
    } catch (error) {
      console.error('Error fetching from Paystack:', error.response?.data || error.message);
      throw new Error('Failed to fetch payments from Paystack');
    }
  }

  private mapPaystackStatus(status: string): 'PAID' | 'PENDING' | 'FAILED' {
    switch (status) {
      case 'success':
        return 'PAID';
      case 'pending':
        return 'PENDING';
      case 'failed':
      case 'reversed':
        return 'FAILED';
      default:
        return 'PENDING';
    }
  }

  async getPaymentStats() {
    try {
      // Get payments data (either from local DB or Paystack)
      const payments = await this.getAllPayments();
      
      // Calculate stats from the payments data
      const totalPayments = payments.length;
      const successfulPayments = payments.filter(p => p.paymentStatus === 'PAID').length;
      const failedPayments = payments.filter(p => p.paymentStatus === 'FAILED').length;
      const totalRevenue = payments
        .filter(p => p.paymentStatus === 'PAID')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      return {
        totalPayments,
        successfulPayments,
        failedPayments,
        totalRevenue,
        successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
      };
    } catch (error) {
      console.error('Error calculating payment stats:', error);
      return {
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalRevenue: 0,
        successRate: 0,
      };
    }
  }

  async recordPayment(data: {
    bookingId: string;
    amount: number;
    paystackRef: string;
    paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
    paymentDate?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) {
    try {
      // Check if payment already exists
      const existingPayment = await this.prisma.payment.findUnique({
        where: { paystackRef: data.paystackRef },
      });

      if (existingPayment) {
        console.log('Payment record already exists:', data.paystackRef);
        return existingPayment;
      }

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          bookingId: data.bookingId,
          amount: data.amount,
          paystackRef: data.paystackRef,
          paymentStatus: data.paymentStatus,
          paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
          paymentMethod: 'card',
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

      // Create notification for user if they have userId
      if (payment.booking.userId && data.paymentStatus === 'PAID') {
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

      return payment;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw new Error('Failed to record payment');
    }
  }

  async handleWebhook(body: any) {
    try {
      const { event, data } = body;

      if (event === 'charge.success') {
        const { reference } = data;
        
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

        if (paymentData.status === 'success') {
          // Update payment record
          const payment = await this.prisma.payment.update({
            where: { paystackRef: reference },
            data: {
              paymentStatus: 'PAID',
              paymentDate: new Date(),
              paymentMethod: paymentData.channel,
            },
            include: {
              booking: {
                include: {
                  user: true,
                },
              },
            },
          });

          // Update booking status
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

          console.log(`Payment successful for reference: ${reference}`);
        }
      }

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { success: false, message: 'Webhook processing failed' };
    }
  }
}
