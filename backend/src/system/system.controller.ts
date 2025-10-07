import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { SystemService } from './system.service';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system statistics (Admin only)' })
  getStats() {
    return this.systemService.getStats();
  }

  @Get('settings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all system settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  async getAllSettings(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view system settings');
    }
    return this.systemService.getAllSettings();
  }

  @Get('settings/:key')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific setting by key (Admin only)' })
  @ApiResponse({ status: 200, description: 'Setting retrieved successfully' })
  async getSetting(@Param('key') key: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view system settings');
    }
    return this.systemService.getSetting(key);
  }

  @Post('settings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update multiple settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateMultipleSettings(
    @Body() body: { settings: Array<{key: string; value: any; type?: string}> },
    @Request() req
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update system settings');
    }
    return this.systemService.updateMultipleSettings(body.settings);
  }

  @Put('settings/:key')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update specific setting (Admin only)' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  async updateSetting(
    @Param('key') key: string,
    @Body() body: { value: any; type?: string },
    @Request() req
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update system settings');
    }
    return this.systemService.updateSetting(key, body.value, body.type || 'string');
  }

  @Delete('settings/:key')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific setting (Admin only)' })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  async deleteSetting(@Param('key') key: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can delete system settings');
    }
    return this.systemService.deleteSetting(key);
  }
}
