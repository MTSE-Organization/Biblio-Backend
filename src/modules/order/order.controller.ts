import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiResponseNoData } from '@/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import {
  CreateOrderForm,
  FilterOrderForm,
  PlaceOrderForm,
  UpdateStatusForm
} from './forms';
import { MapperUtil } from '@/utils';
import { OrderAutoCompleteDto, OrderDto } from './dtos';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponseNoData({
    objectName: 'order',
    type: 'create'
  })
  // @PCode('GR_C')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req, @Body() form: CreateOrderForm) {
    return await this.orderService.create(form, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('place')
  async place(@Req() req, @Body() form: PlaceOrderForm) {
    return await this.orderService.placeOrder(form, req.user.id);
  }

  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  async get(@Req() req, @Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.orderService.findByIdAndAccount(id, req.user.id),
      OrderDto
    );
  }

  @Get('private/get/:id')
  @UseGuards(JwtAuthGuard)
  async adminGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(await this.orderService.findById(id), OrderDto);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Req() req, @Body() form: FilterOrderForm) {
    form.accountId = req.user.id;
    const { orders, count } = await this.orderService.findAll(form);
    return {
      content: MapperUtil.toDtoList(orders, OrderAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @Get('private/list')
  @UseGuards(JwtAuthGuard)
  async adminlist(@Body() form: FilterOrderForm) {
    const { orders, count } = await this.orderService.findAll(form);
    return {
      content: MapperUtil.toDtoList(orders, OrderAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @Put('update-status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Body() form: UpdateStatusForm) {
    return await this.orderService.updateStatus(form);
  }
}
