import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    await this.cacheManager.set(email, otp, 5 * 60 * 1000); // 5 minutes
    const cachedOtp = await this.cacheManager.get(email);
    console.log({ email, cachedOtp, otp });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const cachedOtp = await this.cacheManager.get(email);
    console.log({ email, cachedOtp, otp });
    if (cachedOtp !== otp) {
      return false;
    }
    await this.cacheManager.del(email);
    return true;
  }
}
