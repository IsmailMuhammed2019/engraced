import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get review statistics' })
  getStats() {
    return this.reviewsService.getStats();
  }
}
