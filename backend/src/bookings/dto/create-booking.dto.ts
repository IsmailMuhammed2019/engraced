import { IsString, IsNumber, IsArray, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'user-id-here', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'trip-id-here' })
  @IsString()
  tripId: string;

  @ApiProperty({ example: 'route-id-here' })
  @IsString()
  routeId: string;

  @ApiProperty({ example: 'promo-id-here', required: false })
  @IsOptional()
  @IsString()
  promotionId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  passengerCount: number;

  @ApiProperty({ 
    example: { phone: '+2348071116229', email: 'user@example.com' }
  })
  @IsObject()
  contactInfo: object;

  @ApiProperty({ 
    example: [
      { name: 'John Doe', age: 35 },
      { name: 'Jane Doe', age: 32 }
    ]
  })
  @IsArray()
  passengerDetails: object[];

  @ApiProperty({ example: ['A1', 'B2'] })
  @IsArray()
  @IsString({ each: true })
  seatNumbers: string[];

  @ApiProperty({ example: 'Special requests', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}