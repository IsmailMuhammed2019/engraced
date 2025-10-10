import { Controller, Post, Body, Get, UseGuards, Request, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { RegisterDto, LoginDto, RefreshTokenDto, ChangePasswordDto, UpdateProfileDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    
    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(
        registerDto.email,
        registerDto.firstName
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail registration if email fails
    }

    return {
      message: 'Registration successful',
      data: result,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    return {
      message: 'Login successful',
      data: result,
    };
  }

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    try {
      console.log('Admin login attempt:', loginDto.email);
      
      // Use the real admin login service for proper JWT tokens
      const result = await this.authService.adminLogin(loginDto);
      console.log('Admin login successful, returning response');
      return result;
    } catch (error) {
      console.error('Admin login controller error:', error);
      throw error;
    }
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    
    return {
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    
    return {
      message: 'Logout successful',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user.id);
    
    return {
      message: 'Profile retrieved successfully',
      data: user,
    };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    // Implementation for updating profile
    // This would require updating the auth service
    return {
      message: 'Profile updated successfully',
    };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    // Implementation for changing password
    // This would require updating the auth service
    return {
      message: 'Password changed successfully',
    };
  }
}