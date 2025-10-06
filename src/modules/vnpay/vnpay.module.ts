import { Module } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [VnpayService],
  imports: [HttpModule],
  exports: [VnpayService]
})
export class VnpayModule {}
