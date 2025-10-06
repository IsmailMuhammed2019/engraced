import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone, address } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        address,
        isActive: true,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate JWT tokens
    const payload = { 
      sub: user.id, 
      email: user.email,
      type: 'access'
    };
    
    const accessToken = this.jwtService.sign(payload, { 
      expiresIn: '15m',
      secret: process.env.JWT_SECRET 
    });
    
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' }, 
      { 
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET 
      }
    );

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const payload = { 
      sub: user.id, 
      email: user.email,
      type: 'access'
    };
    
    const accessToken = this.jwtService.sign(payload, { 
      expiresIn: '15m',
      secret: process.env.JWT_SECRET 
    });
    
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' }, 
      { 
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET 
      }
    );

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      // Check if this is an admin token
      if (payload.type === 'admin') {
        // Verify admin token exists in database
        const adminTokenRecord = await this.prisma.adminRefreshToken.findFirst({
          where: {
            token: refreshToken,
            adminId: payload.sub,
            expiresAt: { gt: new Date() },
          },
        });

        if (!adminTokenRecord) {
          throw new UnauthorizedException('Invalid admin refresh token');
        }

        // Get admin
        const admin = await this.prisma.admin.findUnique({
          where: { id: payload.sub },
        });

        if (!admin || !admin.isActive) {
          throw new UnauthorizedException('Admin not found or inactive');
        }

        // Generate new access token for admin
        const newAccessToken = this.jwtService.sign(
          { sub: admin.id, email: admin.email, type: 'admin' },
          { 
            expiresIn: '15m',
            secret: process.env.JWT_SECRET 
          }
        );

        return {
          accessToken: newAccessToken,
          user: {
            id: admin.id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role,
            type: 'admin'
          },
        };
      } else {
        // Handle regular user token
        const tokenRecord = await this.prisma.refreshToken.findFirst({
          where: {
            token: refreshToken,
            userId: payload.sub,
            expiresAt: { gt: new Date() },
          },
        });

        if (!tokenRecord) {
          throw new UnauthorizedException('Invalid refresh token');
        }

        // Get user
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
            isActive: true,
            emailVerified: true,
            createdAt: true,
          },
        });

        if (!user || !user.isActive) {
          throw new UnauthorizedException('User not found or inactive');
        }

        // Generate new access token
        const newPayload = { 
          sub: user.id, 
          email: user.email,
          type: 'access'
        };
        
        const newAccessToken = this.jwtService.sign(newPayload, { 
          expiresIn: '15m',
          secret: process.env.JWT_SECRET 
        });

        return {
          user,
          accessToken: newAccessToken,
        };
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      // Check if this is an admin token
      if (payload.type === 'admin') {
        // Remove admin refresh token from database
        await this.prisma.adminRefreshToken.deleteMany({
          where: { token: refreshToken },
        });
      } else {
        // Remove user refresh token from database
        await this.prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      return { message: 'Logged out successfully' };
    } catch (error) {
      // If token is invalid, still return success for logout
      return { message: 'Logged out successfully' };
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  async validateAdmin(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    return admin;
  }

  async validateUserByEmail(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async adminLogin(loginDto: LoginDto) {
    try {
      console.log('Admin login service called for:', loginDto.email);
      const { email, password } = loginDto;

      // Find admin by email
      console.log('Looking for admin with email:', email);
      const admin = await this.prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        console.log('Admin not found for email:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('Admin found:', admin.id, admin.isActive);

      if (!admin.isActive) {
        console.log('Admin account is inactive');
        throw new UnauthorizedException('Admin account is deactivated');
      }

      // Verify password
      console.log('Verifying password...');
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Invalid password for admin:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

    // Update last login
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { updatedAt: new Date() },
    });

    // Generate JWT tokens
    const payload = { 
      sub: admin.id, 
      email: admin.email,
      type: 'admin'
    };
    
    const accessToken = this.jwtService.sign(payload, { 
      expiresIn: '15m',
      secret: process.env.JWT_SECRET 
    });
    
    const refreshToken = this.jwtService.sign(
      { sub: admin.id, type: 'refresh' }, 
      { 
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET 
      }
    );

    // Store admin refresh token in database
    try {
      await this.prisma.adminRefreshToken.create({
        data: {
          token: refreshToken,
          adminId: admin.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } catch (error) {
      console.error('Error creating admin refresh token:', error);
      // Continue without storing refresh token for now
    }

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
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }
}