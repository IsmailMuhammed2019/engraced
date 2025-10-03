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

import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle (Admin only)' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Vehicle already exists' })
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can create vehicles');
    }
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'Vehicles retrieved successfully' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active vehicles' })
  @ApiResponse({ status: 200, description: 'Active vehicles retrieved successfully' })
  findActive() {
    return this.vehiclesService.findActive();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available vehicles for a date range' })
  @ApiResponse({ status: 200, description: 'Available vehicles retrieved successfully' })
  getAvailableVehicles(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.vehiclesService.getAvailableVehicles(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get vehicle statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vehicle statistics retrieved' })
  getVehicleStats(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view vehicle statistics');
    }
    return this.vehiclesService.getVehicleStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update vehicles');
    }
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate vehicle (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vehicle deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 409, description: 'Vehicle has active trips' })
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can deactivate vehicles');
    }
    return this.vehiclesService.remove(id);
  }
}
