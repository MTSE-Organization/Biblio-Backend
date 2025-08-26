import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  private getDefaultMessage(method: string, path: string): string {
    const basePath = path.split('/').filter(Boolean)[0];
    switch (method) {
      case 'POST':
        return `Create ${basePath} successfully`;
      case 'GET':
        if (path.includes('list')) {
          return `Get list ${basePath} successfully`;
        }
        return `Get ${basePath} successfully`;
      case 'PUT':
        return `Update ${basePath} successfully`;
      case 'DELETE':
        return `Delete ${basePath} successfully`;
      default:
        return 'Request done';
    }
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const startTime = Number(request['startTime']);
    const endTime = Date.now();
    const takenTime = `${endTime - startTime}ms`;
    const url: string = request.url;
  
    return next.handle().pipe(
      map((data: any) => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data
        ) {
          return data as ApiResponse<T>;
        }
        let message: string = this.getDefaultMessage(request.method, url);
        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message as string;
          const { message: _, ...rest } = data;
          data = Object.keys(rest).length > 0 ? rest : undefined;
        }

        if (data && typeof data === 'object' && 'data' in data) {
          data = data.data as T;
        }

        if (Object.keys(data || {}).length == 0) {
          return {
            result: true,
            message,
            date: new Date().toLocaleString('vi-VN', {
              timeZone: 'Asia/Ho_Chi_Minh',
              hour12: false,
            }),
            path: url,
            takenTime,
          };
        }

        return {
          result: true,
          message,
          data,
          date: new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          path: url,
          takenTime,
        };
      }),
    );
  }
}
