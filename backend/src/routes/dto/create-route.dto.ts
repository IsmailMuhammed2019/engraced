import { IsString, IsNumber, IsOptional, IsBoolean, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRouteDto {
  @ApiProperty({ example: 'Lagos' })
  @IsString()
  from: string;

  @ApiProperty({ example: 'Abuja' })
  @IsString()
  to: string;

  @ApiProperty({ example: 720, description: 'Distance in kilometers' })
  @IsNumber()
  distance: number;

  @ApiProperty({ example: 510, description: 'Duration in minutes' })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 7500.00 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  basePrice: number;

  @ApiProperty({ example: 'Premium route connecting Lagos to Abuja', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
