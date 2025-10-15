import { Controller, Get, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('get-bank-list')
  async getBankList() {
    return this.paymentService.getBankList();
  }

  @Get('verify-return-url')
  async verifyReturnUrl(@Query() params, @Res() res: Response) {
    const { orderId, paymentStatus, redirectUri } =
      await this.paymentService.verifyReturnUrl(params);
    console.log({ orderId, paymentStatus });

    const redirectUrl = `${redirectUri}?orderId=${orderId}&paymentStatus=${paymentStatus}`;
    return res.redirect(redirectUrl);
  }
}
