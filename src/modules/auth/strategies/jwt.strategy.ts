import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDetailsDto } from '../dtos';
import { ErrorCode } from '@/constants/error-code.constant';
import { UnauthorizedException } from '@/common/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string
    });
  }

  validate(payload: any) {
    try {
      const userId = payload.sub || payload.id;
      if (!userId) {
        throw new UnauthorizedException(
          'Invalid token payload',
          ErrorCode.AUTH_ERROR_UNAUTHORIZED
        );
      }
      const user = new UserDetailsDto(
        userId,
        payload.kind,
        payload.authorities,
        payload.isSuperAdmin
      );
      return user;
    } catch (error) {
      console.error(`JWT validation failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
