import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admins')
@Controller('admins')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new admin (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can create admins' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  create(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.adminsService.create(createAdminDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Returns list of all admins' })
  findAll() {
    return this.adminsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admin statistics' })
  @ApiResponse({ status: 200, description: 'Returns admin statistics' })
  getStats() {
    return this.adminsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Returns admin details' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto, @Request() req) {
    return this.adminsService.update(id, updateAdminDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate admin (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Admin deactivated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can delete admins' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.adminsService.remove(id, req.user.id);
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Permanently delete admin (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Admin permanently deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can permanently delete admins' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  permanentDelete(@Param('id') id: string, @Request() req) {
    return this.adminsService.delete(id, req.user.id);
  }
}
