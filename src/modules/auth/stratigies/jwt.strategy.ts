import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  validate(payload: any) {
    try {
      const userId = payload.sub || payload.id;
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const user = {
        userId: userId,
        roles: payload.roles || [],
        kind: payload.kind,
      };
      return user;
    } catch (error) {
      console.error(`JWT validation failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
