import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize payment with Paystack' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  initializePayment(
    @Body() body: {
      bookingId: string;
      amount: number;
      email: string;
    },
  ) {
    return this.paymentsService.initializePayment(
      body.bookingId,
      body.amount,
      body.email,
    );
  }

  @Get('verify/:reference')
  @ApiOperation({ summary: 'Verify payment with Paystack' })
  @ApiResponse({ status: 200, description: 'Payment verification completed' })
  verifyPayment(@Param('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }

  @Get('booking/:bookingId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by booking ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  getPaymentByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentByBookingId(bookingId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  getAllPayments(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view all payments');
    }
    return this.paymentsService.getAllPayments();
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment statistics retrieved' })
  getPaymentStats(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view payment statistics');
    }
    return this.paymentsService.getPaymentStats();
  }
}
