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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@ApiTags('Drivers')
@Controller('drivers')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new driver (Admin only)' })
  @ApiResponse({ status: 201, description: 'Driver created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Driver already exists' })
  create(@Body() createDriverDto: CreateDriverDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can create drivers');
    }
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'Drivers retrieved successfully' })
  findAll() {
    return this.driversService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active drivers' })
  @ApiResponse({ status: 200, description: 'Active drivers retrieved successfully' })
  findActive() {
    return this.driversService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get driver statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Driver statistics retrieved' })
  getDriverStats(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view driver statistics');
    }
    return this.driversService.getDriverStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update driver (Admin only)' })
  @ApiResponse({ status: 200, description: 'Driver updated successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update drivers');
    }
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate driver (Admin only)' })
  @ApiResponse({ status: 200, description: 'Driver deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 409, description: 'Driver has active trips' })
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can deactivate drivers');
    }
    return this.driversService.remove(id);
  }
}
