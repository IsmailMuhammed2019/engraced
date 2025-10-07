import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Promotion name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Promotion type', enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_RIDE'] })
  @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_RIDE'])
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_RIDE';

  @ApiProperty({ description: 'Promotion value' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'Minimum amount', required: false })
  @IsOptional()
  @IsString()
  minAmount?: string;

  @ApiProperty({ description: 'Maximum discount', required: false })
  @IsOptional()
  @IsString()
  maxDiscount?: string;

  @ApiProperty({ description: 'Promotion description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date', example: '2024-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Maximum usage limit', required: false })
  @IsOptional()
  @IsNumber()
  maxUsage?: number;

  @ApiProperty({ description: 'Applicable routes', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableRoutes?: string[];

  @ApiProperty({ description: 'Applicable trips', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableTrips?: string[];

  @ApiProperty({ description: 'Promotion code', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Promotion status', enum: ['active', 'inactive'], required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Promotion conditions', required: false })
  @IsOptional()
  conditions?: {
    minBookingDays?: number;
    userType?: string;
    timeRestriction?: string;
  };
}
