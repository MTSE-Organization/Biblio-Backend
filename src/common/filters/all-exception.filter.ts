import { ApiResponse } from '@/common/interfaces';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const startTime = Number(request['startTime']);
    const endTime = Date.now();
    const takenTime = `${endTime - startTime}ms`;

    let status: number;
    let message: string;
    let error: any;
    let code: string = 'ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const exceptionResponseObj = exceptionResponse as Record<string, any>;
        message =
          (exceptionResponseObj.message as string) ||
          (exceptionResponseObj.error as string) ||
          'An error just happened';
        code = exceptionResponseObj.code || 'ERROR';
        if (Array.isArray(exceptionResponseObj.message)) {
          message = 'Data not suitable';
          error = exceptionResponseObj.message;
        }
      } else {
        message = 'An error just happened';
      }
    } else {
      status = HttpStatus.BAD_REQUEST;
      message = `An error just happened in system: ${exception}`;
    }
    this.logger.error(exception);
    const res: ApiResponse<any> = {
      result: false,
      code,
      message,
      ...(error && { error }),
      date: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false
      }),
      path: request.url,
      takenTime
    };
    response.status(status).json(res);
  }
}
