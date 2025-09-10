import { PCODE_KEY } from '@/common/decorators';
import { UnauthorizedException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const pcode = this.reflector.get<string>(PCODE_KEY, context.getHandler());
      const authorities = request.user?.authorities || [];
      if (pcode && !authorities.includes(pcode)) {
        throw new UnauthorizedException(
          'You do not have permission',
          ErrorCode.AUTH_ERROR_UNAUTHORIZED
        );
      }
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission',
        ErrorCode.AUTH_ERROR_UNAUTHORIZED
      );
    }
    return true;
  }
}
