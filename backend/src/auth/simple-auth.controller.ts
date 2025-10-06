import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './public.decorator';
import { LoginDto } from './dto/auth.dto';
import { SimpleAuthService } from './simple-auth.service';

@Controller('simple-auth')
export class SimpleAuthController {
  constructor(private simpleAuthService: SimpleAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Simple auth login attempt:', loginDto.email);
      const result = await this.simpleAuthService.login(loginDto);
      console.log('Simple auth login successful for:', loginDto.email);
      return {
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      console.error('Simple auth login error:', error);
      throw error;
    }
  }
}
