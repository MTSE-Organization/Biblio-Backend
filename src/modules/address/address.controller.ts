import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressForm, UpdateAddressForm } from './forms';
import { AddressDto } from './dtos';
import { MapperUtil } from '@/utils';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  async create(@Body() form: CreateAddressForm) {
    return await this.addressService.create(form);
  }

  @Put('update')
  async update(@Body() form: UpdateAddressForm) {
    return await this.addressService.update(form);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.addressService.delete(id);
  }

  @Get('account/:accountId')
  async getByAccount(@Param('accountId') accountId: bigint) {
    const result = await this.addressService.findByAccount(accountId);
    return MapperUtil.toDtoList(result, AddressDto);
  }

  @Put('set-default/:id')
  async setDefault(@Param('id') id: bigint) {
    return await this.addressService.setDefault(id);
  }
}
