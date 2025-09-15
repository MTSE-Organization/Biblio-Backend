import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from '@/models/address';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [SequelizeModule.forFeature([Address])]
})
export class AddressModule {}
