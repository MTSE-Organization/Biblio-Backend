import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    await this.redisService.set(email, otp, 5 * 60 * 1000); // 5 minutes
    console.log(await this.redisService.get(email));
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const cachedOtp = await this.redisService.get(email);
    console.log(cachedOtp);

    if (cachedOtp !== otp) {
      return false;
    }
    await this.redisService.delete(email);
    return true;
  }

  async handleResendLimit(email: string): Promise<string> {
    const resendKey = `${email}:otp:resend`;
    const resendCount = parseInt(
      (await this.redisService.get(resendKey)) || '0',
      10
    );
    if (resendCount >= 3) {
      throw new BadRequestException(
        'You have exceeded the maximum number of resend attempts (3 per 10 minutes)',
        ErrorCode.AUTH_ERROR_RESEND_OTP_LIMIT
      );
    }
    const otp = this.generateOtp();

    await this.storeOtp(email, otp);

    if (resendCount === 0) {
      await this.redisService.set(resendKey, 1, 10 * 60 * 1000);
    } else {
      await this.redisService.set(resendKey, resendCount + 1);
    }
    return otp;
  }

  async handleClearOtp(email: string): Promise<void> {
    await this.redisService.deleteByPrefix(`${email}`);
  }
}
