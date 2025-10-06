import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from './public.decorator';
import { LoginDto } from './dto/auth.dto';

@Controller('simple-admin')
export class SimpleAdminController {
  constructor(private jwtService: JwtService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    console.log('Simple admin login attempt:', loginDto.email);
    
    // Simple hardcoded admin check
    if (loginDto.email === 'admin@engracedsmile.com' && loginDto.password === 'admin123') {
      console.log('Simple admin login successful');
      
      // Generate proper JWT tokens with real admin ID
      const accessToken = this.jwtService.sign(
        { sub: 'cmgf1bllh0000vnc6r47hnz8v', email: 'admin@engracedsmile.com', type: 'admin' },
        { expiresIn: '15m', secret: process.env.JWT_SECRET }
      );

      const refreshToken = this.jwtService.sign(
        { sub: 'cmgf1bllh0000vnc6r47hnz8v', email: 'admin@engracedsmile.com', type: 'admin' },
        { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET }
      );

      return {
        message: 'Admin login successful',
        data: {
          user: {
            id: 'cmgf1bllh0000vnc6r47hnz8v',
            email: 'admin@engracedsmile.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            type: 'admin'
          },
          accessToken,
          refreshToken,
        },
      };
    } else {
      console.log('Invalid admin credentials');
      throw new Error('Invalid credentials');
    }
  }
}
