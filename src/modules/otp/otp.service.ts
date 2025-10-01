import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

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
}
