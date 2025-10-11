import { IsString, IsNumber, IsArray, IsOptional, IsObject, IsEnum } from 'class-validator';
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

  @ApiProperty({ example: 'PROMO123', required: false })
  @IsOptional()
  @IsString()
  promotionCode?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  passengerCount: number;

  @ApiProperty({ 
    example: { phone: '+2348071116229', email: 'user@example.com', name: 'John Doe' }
  })
  @IsObject()
  contactInfo: object;

  @ApiProperty({ 
    example: [
      { name: 'John Doe', email: 'john@example.com', phone: '+2348071116229' },
      { name: 'Jane Doe', email: 'jane@example.com', phone: '+2348071116229' }
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

  @ApiProperty({ example: 'PAY_123456', required: false })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiProperty({ example: 'PAID', required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @ApiProperty({ example: 15000, required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}