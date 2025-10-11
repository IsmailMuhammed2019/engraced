import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { Public } from '../auth/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-email/:email')
  @Public()
  @ApiOperation({ summary: 'Get user by email' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
