import { ROLE_KEY } from '@/common/decorators';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const role = this.reflector.get<string>(ROLE_KEY, context.getHandler());
      const authorities = request.user?.authorities || [];
      if (role && !authorities.includes(role)) {
        throw new UnauthorizedException('You do not have permission');
      }
    } catch (error) {
      throw new UnauthorizedException('You do not have permission');
    }
    return true;
  }
}
