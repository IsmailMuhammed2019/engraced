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

import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new trip (Admin only)' })
  @ApiResponse({ status: 201, description: 'Trip created successfully' })
  create(@Body() createTripDto: CreateTripDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can create trips');
    }
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active trips' })
  @ApiResponse({ status: 200, description: 'Trips retrieved successfully' })
  findAll(
    @Query('routeId') routeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
  ) {
    return this.tripsService.findAll(routeId, from, to, date);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search trips by route and date' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  searchTrips(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: string,
    @Query('passengers') passengers?: string,
  ) {
    return this.tripsService.searchTrips(from, to, date, passengers ? parseInt(passengers) : 1);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Get available seats for a trip' })
  @ApiResponse({ status: 200, description: 'Seats retrieved successfully' })
  getAvailableSeats(@Param('id') id: string) {
    return this.tripsService.getAvailableSeats(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update trip (Admin only)' })
  @ApiResponse({ status: 200, description: 'Trip updated successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update trips');
    }
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete trip permanently (Admin only)' })
  @ApiResponse({ status: 200, description: 'Trip deleted successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete trip with bookings' })
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can delete trips');
    }
    return this.tripsService.delete(id);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel trip (Admin only)' })
  @ApiResponse({ status: 200, description: 'Trip cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  cancel(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can cancel trips');
    }
    return this.tripsService.remove(id);
  }
}
