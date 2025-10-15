import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { VnpayConfigModule } from '../vnpay-config/vnpay-config.module';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [VnpayConfigModule, forwardRef(() => OrderModule)],
  exports: [PaymentService]
})
export class PaymentModule {}
