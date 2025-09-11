import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable, delay } from 'rxjs';

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  constructor(private readonly ms: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(delay(this.ms));
  }
}
