import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  providers: [OtpService],
  imports: [RedisModule],
  exports: [OtpService]
})
export class OtpModule {}
