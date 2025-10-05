import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AddressService } from './address.service';
import {
  CreateAddressForm,
  UpdateAddressForm,
  FilterAddressForm,
  GetShippingFeeForm
} from './forms';
import { AddressDto, GetShippingFeeDto } from './dtos';
import { MapperUtil } from '@/utils';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData
} from '@/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { UserDetailsDto } from '../auth/dtos';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiResponseNoData({ objectName: 'address', type: 'create' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req: any, @Body() form: CreateAddressForm) {
    const user: UserDetailsDto = req.user;
    return await this.addressService.create(form, user.id);
  }

  @ApiResponseNoData({ objectName: 'address', type: 'update' })
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Req() req: any, @Body() form: UpdateAddressForm) {
    const user: UserDetailsDto = req.user;
    return await this.addressService.update(form, user.id);
  }

  @ApiResponseNoData({ objectName: 'address', type: 'delete' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Req() req: any, @Param('id') id: bigint) {
    const user: UserDetailsDto = req.user;
    return await this.addressService.delete(id, user.id);
  }

  @ApiListResponse(AddressDto, { objectName: 'address' })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Req() req: any, @Query() form: FilterAddressForm) {
    const { addresses, count } = await this.addressService.findAll(
      form,
      req.user.id
    );
    return {
      content: MapperUtil.toDtoList(addresses, AddressDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @ApiResponseNoData({ objectName: 'address', type: 'update' })
  @UseGuards(JwtAuthGuard)
  @Put('set-default/:id')
  async setDefault(@Req() req: any, @Param('id') id: bigint) {
    const user: UserDetailsDto = req.user;
    return await this.addressService.setDefault(id, user.id);
  }

  @ApiResponse(AddressDto, { objectName: 'address' })
  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  async get(@Req() req: any, @Param('id') id: bigint) {
    const user: UserDetailsDto = req.user;
    const address = await this.addressService.findById(id, user.id);
    return MapperUtil.toDto(address, AddressDto);
  }

  @ApiResponse(GetShippingFeeDto, {
    objectName: 'address',
    message: 'Get shipping fee successfully'
  })
  @UseGuards(JwtAuthGuard)
  @Post('shipping-fee')
  async shippingFee(@Req() req: any, @Body() form: GetShippingFeeForm) {
    const user: UserDetailsDto = req.user;

    return {
      data: new GetShippingFeeDto(
        await this.addressService.getShippingFee(form, user.id)
      ),
      message: 'Get shipping fee successfully'
    };
  }
}
