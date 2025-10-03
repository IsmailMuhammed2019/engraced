import { IsString, IsEmail, IsDateString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348071116229' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'DL123456789' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  licenseExpiry: string;

  @ApiProperty({ example: '123 Main Street, Lagos' })
  @IsString()
  address: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  experience?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
