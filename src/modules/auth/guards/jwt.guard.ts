import { UnauthorizedException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      const message =
        info?.name === 'TokenExpiredError'
          ? 'Token expired'
          : info?.name === 'JsonWebTokenError'
            ? 'Invalid token'
            : 'Unauthorized';
      throw new UnauthorizedException(
        message,
        ErrorCode.AUTH_ERROR_UNAUTHORIZED,
      );
    }
    return user as TUser;
  }
}
