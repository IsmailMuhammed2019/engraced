import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 409, description: 'Seats not available' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  findAll(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view all bookings');
    }
    return this.bookingsService.findAll();
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings for a specific user' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully' })
  findByUser(@Param('userId') userId: string, @Request() req) {
    // Users can only view their own bookings
    if (req.user.type !== 'admin' && req.user.id !== userId) {
      throw new Error('You can only view your own bookings');
    }
    return this.bookingsService.findByUser(userId);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Booking statistics retrieved' })
  getStats(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view booking statistics');
    }
    return this.bookingsService.getBookingStats();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking (Admin only)' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update bookings');
    }
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
    @Request() req,
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update booking status');
    }
    return this.bookingsService.updateStatus(id, body.status, body.reason);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.bookingsService.remove(id);
  }
}
