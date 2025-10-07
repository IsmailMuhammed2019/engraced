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

import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiResponse({ status: 201, description: 'Promotion created successfully' })
  create(@Body() createPromotionDto: CreatePromotionDto, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can create promotions');
    }
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promotions' })
  @ApiResponse({ status: 200, description: 'Promotions retrieved successfully' })
  findAll(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view all promotions');
    }
    return this.promotionsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active promotions (public)' })
  @ApiResponse({ status: 200, description: 'Active promotions retrieved successfully' })
  findActive() {
    return this.promotionsService.findActive();
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotion statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promotion statistics retrieved' })
  getStats(@Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can view promotion statistics');
    }
    return this.promotionsService.getPromotionStats();
  }

  @Post('validate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate promotion code' })
  @ApiResponse({ status: 200, description: 'Promotion code validated successfully' })
  @ApiResponse({ status: 404, description: 'Promotion code not found' })
  async validatePromoCode(
    @Body() body: { code: string; bookingAmount: number },
    @Request() req,
  ) {
    return this.promotionsService.validatePromoCode(body.code, body.bookingAmount);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiResponse({ status: 200, description: 'Promotion retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promotion (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promotion updated successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @Request() req,
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can update promotions');
    }
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promotion (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can delete promotions');
    }
    return this.promotionsService.remove(id);
  }
}
