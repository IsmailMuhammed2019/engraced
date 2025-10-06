import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SimpleAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    try {
      console.log('Simple login attempt for:', loginDto.email);
      
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        console.log('User inactive');
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('Password valid, generating tokens');

      // Generate access token
      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, type: 'access' },
        { 
          expiresIn: '15m',
          secret: process.env.JWT_SECRET 
        }
      );

      // Generate refresh token
      const refreshToken = this.jwtService.sign(
        { sub: user.id, email: user.email, type: 'refresh' },
        { 
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET 
        }
      );

      console.log('Tokens generated successfully');

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          type: 'user'
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Simple login error:', error);
      throw error;
    }
  }
}
