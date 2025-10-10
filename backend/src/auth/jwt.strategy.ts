import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Check if this is an admin token
    if (payload.type === 'admin') {
      // Validate admin from database
      const admin = await this.authService.validateAdmin(payload.sub);
      if (!admin) {
        throw new UnauthorizedException('Invalid admin token');
      }
      return {
        id: admin.id,
        email: admin.email,
        type: 'admin',
        role: admin.role
      };
    }
    
    // Regular user validation
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid user token');
    }
    return {
      id: user.id,
      email: user.email,
      type: 'user'
    };
  }
}
