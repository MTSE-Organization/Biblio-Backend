import { Order } from '@/models';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';
import { OrderService } from '../order/order.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly callbackUrl: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly vnpayService: VnpayService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService
  ) {
    this.callbackUrl = this.configService.get<string>('VNPAY_RETURN_URL')!;
    this.redirectUri = this.configService.get<string>('VNPAY_REDIRECT_URI')!;
  }

  async getBankList() {
    return this.vnpayService.getBankList();
  }

  getPaymentUrl(order: Order) {
    const paymentUrl = this.vnpayService.buildPaymentUrl({
      vnp_Amount: Number(order.total),
      vnp_IpAddr: '127.0.0.1',
      vnp_ReturnUrl: this.callbackUrl,
      vnp_TxnRef: order.id.toString(),
      vnp_OrderInfo: `Thanh toán đơn hàng ${order.id}`
    });
    return paymentUrl;
  }

  async verifyReturnUrl(params) {
    const verify = await this.vnpayService.verifyReturnUrl(params);
    const paymentStatus = verify.vnp_ResponseCode;
    const orderId = verify.vnp_TxnRef;
    if (verify.isSuccess) {
      await this.orderService.handleNewOrder(BigInt(orderId));
      console.log('Thanh toán thành công!', verify.message);
    } else {
      console.log('Thanh toán thất bại:', verify.message);
    }
    return { orderId, paymentStatus, redirectUri: this.redirectUri };
  }
}
