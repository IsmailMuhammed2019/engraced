import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTripDto {
  @ApiProperty({ example: 'route-id-here' })
  @IsString()
  routeId: string;

  @ApiProperty({ example: 'driver-id-here' })
  @IsString()
  driverId: string;

  @ApiProperty({ example: 'vehicle-id-here' })
  @IsString()
  vehicleId: string;

  @ApiProperty({ example: '2024-10-15T06:00:00Z' })
  @IsDateString()
  departureTime: string;

  @ApiProperty({ example: '2024-10-15T14:30:00Z' })
  @IsDateString()
  arrivalTime: string;

  @ApiProperty({ example: 7500.00, required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'promotion-id-here', required: false })
  @IsOptional()
  @IsString()
  promotionId?: string;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  maxPassengers?: number;

  @ApiProperty({ 
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'COMPLETED'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'CANCELLED', 'COMPLETED'])
  status?: string;

  @ApiProperty({ 
    example: ['Wi-Fi', 'Refreshments', 'Comfortable Seats'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ 
    example: ['Air Conditioning', 'Reclining Seats', 'Onboard Toilet'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
