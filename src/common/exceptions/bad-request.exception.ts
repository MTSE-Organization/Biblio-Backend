import { HttpException, HttpStatus } from '@nestjs/common';

interface BadRequestResponse {
  message: string;
  code: string | number;
}

export class BadRequestException extends HttpException {
  constructor(message: string, code: string | number = 'BAD_REQUEST') {
    const response: BadRequestResponse = {
      message,
      code,
    };

    super(response, HttpStatus.BAD_REQUEST);
  }
}
