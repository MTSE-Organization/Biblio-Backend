import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';

@Injectable()
export class VnpayService {
  private readonly tmnCode: string;
  private readonly secretKey: string;
  private readonly vnpUrl: string;
  private readonly returnUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.tmnCode = this.configService.get<string>('VNPAY_TMN_CODE')!;
    this.secretKey = this.configService.get<string>('VNPAY_HASH_SECRET')!;
    this.vnpUrl = this.configService.get<string>('VNPAY_URL')!;
    this.returnUrl = this.configService.get<string>('VNPAY_RETURN_URL')!;
  }

  /**
   * Tạo URL thanh toán VNPAY
   * @param orderId id đơn hàng
   * @param amount số tiền (VND)
   * @param ipAddr số tiền (VND)
   * @param bankCode mã ngân hàng (tùy chọn)
   */
  createPaymentUrl(
    orderId: string,
    amount: number,
    ipAddr: string,
    bankCode?: string
  ): string {
    const createDate = moment().format('YYYYMMDDHHmmss');
    const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');

    const orderInfo = `Thanh toan don hang ${orderId}`;
    const currCode = 'VND';
    const locale = 'vn';
    const vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: (amount * 100).toString(),
      vnp_CreateDate: createDate,
      vnp_CurrCode: currCode,
      vnp_IpAddr: '13.160.92.202',
      vnp_Locale: locale,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: this.returnUrl,
      vnp_ExpireDate: expireDate,
      vnp_TxnRef: orderId
    };

    if (bankCode) {
      vnpParams['vnp_BankCode'] = bankCode;
    }

    const sorted: Record<string, string> = {};
    Object.keys(vnpParams)
      .sort()
      .forEach((key) => {
        sorted[key] = vnpParams[key];
      });

    // stringify để ký
    const signData = qs.stringify(sorted, { encode: false });
    console.log({ signData });

    const hmac = crypto.createHmac('sha512', this.secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    console.log({ signed });

    // gắn hash vào params
    sorted['vnp_SecureHash'] = signed;

    return `${this.vnpUrl}?${qs.stringify(sorted, { encode: true })}`;
  }
}
