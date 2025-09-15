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
import {
  CreateAddressForm,
  UpdateAddressForm,
  FilterAddressForm
} from './forms';
import { AddressDto } from './dtos';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';

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

  @Get('list')
  async list(@Body() form: FilterAddressForm) {
    const { addresses, count } = await this.addressService.findAll(form);
    return {
      content: MapperUtil.toDtoList(addresses, AddressDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @Put('set-default/:id')
  async setDefault(@Param('id') id: bigint) {
    return await this.addressService.setDefault(id);
  }
}
