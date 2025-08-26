import { HttpException, HttpStatus } from '@nestjs/common';

interface CustomNotFoundResponse {
    message: string;
    code: string | number;
}

export class NotFoundException extends HttpException {
    constructor(message: string, code: string | number = 'BAD_REQUEST') {
        const response: CustomNotFoundResponse = {
            message,
            code
        };

        super(response, HttpStatus.NOT_FOUND);
    }
}
