import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomUnauthorizedResponse {
  message: string;
  code: string | number;
}

export class UnauthorizedException extends HttpException {
  constructor(message: string, code: string | number = 'BAD_REQUEST') {
    const response: CustomUnauthorizedResponse = {
      message,
      code,
    };

    super(response, HttpStatus.UNAUTHORIZED);
  }
}
