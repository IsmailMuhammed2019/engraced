import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC123XY' })
  @IsString()
  plateNumber: string;

  @ApiProperty({ example: 'Toyota', required: false })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiProperty({ example: 'Sienna', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 2022 })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({ 
    example: ['AC', 'WiFi', 'USB Charging', 'Reclining Seats'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ example: 50000, required: false })
  @IsOptional()
  @IsNumber()
  mileage?: number;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  lastService?: string;

  @ApiProperty({ example: '2024-07-15', required: false })
  @IsOptional()
  @IsDateString()
  nextService?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
