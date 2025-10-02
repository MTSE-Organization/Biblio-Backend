import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import {
  CreateOrderForm,
  FilterOrderForm,
  PlaceOrderForm,
  UpdateStatusForm
} from './forms';
import { MapperUtil } from '@/utils';
import { CreateOrderDto, OrderAutoCompleteDto, OrderDto } from './dtos';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse(CreateOrderDto, {
    objectName: 'order',
    message: 'Create order successfully'
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req, @Body() form: CreateOrderForm) {
    return await this.orderService.create(form, req.user.id);
  }

  @ApiResponseNoData({
    objectName: 'order',
    message: 'Place order successfully'
  })
  @UseGuards(JwtAuthGuard)
  @Post('place')
  async place(@Req() req, @Body() form: PlaceOrderForm) {
    return await this.orderService.placeOrder(form, req.user.id);
  }

  @ApiResponse(OrderDto, { objectName: 'order' })
  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  async get(@Req() req, @Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.orderService.findByIdAndAccount(id, req.user.id),
      OrderDto
    );
  }

  @ApiResponse(OrderDto, { objectName: 'order' })
  @Get('private/get/:id')
  @PCode('ORD_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  async adminGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(await this.orderService.findById(id), OrderDto);
  }

  @ApiListResponse(OrderAutoCompleteDto, { objectName: 'order' })
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Req() req, @Query() form: FilterOrderForm) {
    form.accountId = req.user.id;
    const { orders, count } = await this.orderService.findAll(form);
    return {
      content: MapperUtil.toDtoList(orders, OrderAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @ApiListResponse(OrderAutoCompleteDto, { objectName: 'order' })
  @Get('private/list')
  @PCode('ORD_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  async adminList(@Query() form: FilterOrderForm) {
    const { orders, count } = await this.orderService.findAll(form);
    return {
      content: MapperUtil.toDtoList(orders, OrderAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @ApiResponseNoData({ objectName: 'order', type: 'update' })
  @Put('update-status')
  @PCode('ORD_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  async updateStatus(@Body() form: UpdateStatusForm) {
    return await this.orderService.updateStatus(form);
  }

  @ApiResponseNoData({
    objectName: 'order',
    message: 'Cannel order successfully'
  })
  @Put('cancel/:id')
  @UseGuards(JwtAuthGuard)
  async cancel(@Req() req, @Param('id') id: bigint) {
    return await this.orderService.cancel(id, req.user.id);
  }
}
