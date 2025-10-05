import { forwardRef, Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from '@/models';
import { AccountModule } from '../account/account.module';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
  imports: [
    SequelizeModule.forFeature([Address]),
    forwardRef(() => AccountModule),
    HttpModule,
    forwardRef(() => OrderModule)
  ]
})
export class AddressModule {}
