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

import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new route (Admin only)' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createRouteDto: CreateRouteDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can create routes');
    }
    return this.routesService.create(createRouteDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active routes' })
  @ApiResponse({ status: 200, description: 'Routes retrieved successfully' })
  findAll() {
    return this.routesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search routes by cities' })
  @ApiResponse({ status: 200, description: 'Route found' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  findByCities(@Query('from') from: string, @Query('to') to: string) {
    return this.routesService.findByCities(from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiResponse({ status: 200, description: 'Route retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Get(':id/stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get route statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Route statistics retrieved' })
  getRouteStats(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view route statistics');
    }
    return this.routesService.getRouteStats(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update route (Admin only)' })
  @ApiResponse({ status: 200, description: 'Route updated successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update routes');
    }
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete route permanently (Admin only)' })
  @ApiResponse({ status: 200, description: 'Route deleted successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete route with trips' })
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can delete routes');
    }
    return this.routesService.delete(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate route (Admin only)' })
  @ApiResponse({ status: 200, description: 'Route deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  deactivate(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can deactivate routes');
    }
    return this.routesService.remove(id);
  }
}
