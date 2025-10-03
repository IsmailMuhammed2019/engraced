import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AdminsService } from './admins.service';

@ApiTags('Admins')
@Controller('admins')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all admins (Super Admin only)' })
  findAll() {
    return this.adminsService.findAll();
  }
}
