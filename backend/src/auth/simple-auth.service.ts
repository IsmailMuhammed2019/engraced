import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SimpleAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    try {
      console.log('Simple login attempt for:', loginDto.email);
      
      // Try to find admin first
      const admin = await this.prisma.admin.findUnique({
        where: { email: loginDto.email },
      });

      if (admin) {
        console.log('Admin found, authenticating...');
        
        if (!admin.isActive) {
          console.log('Admin inactive');
          throw new UnauthorizedException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
        if (!isPasswordValid) {
          console.log('Invalid admin password');
          throw new UnauthorizedException('Invalid credentials');
        }

        console.log('Admin password valid, generating tokens');

        // Generate access token for admin
        const accessToken = this.jwtService.sign(
          { sub: admin.id, email: admin.email, type: 'admin', role: admin.role },
          { 
            expiresIn: '15m',
            secret: process.env.JWT_SECRET 
          }
        );

        // Generate refresh token
        const refreshToken = this.jwtService.sign(
          { sub: admin.id, email: admin.email, type: 'refresh', role: admin.role },
          { 
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET 
          }
        );

        console.log('Admin tokens generated successfully');

        return {
          user: {
            id: admin.id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role,
            type: 'admin'
          },
          accessToken,
          refreshToken,
        };
      }
      
      // If not admin, try regular user
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
        { sub: user.id, email: user.email, type: 'user' },
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
