import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { UserDetailsDto } from '../auth/dtos';
import { MapperUtil } from '@/utils';
import { CartDto } from './dtos';
import { AddItemForm } from './forms';
import { ApiResponse, ApiResponseNoData, PCode } from '@/common/decorators';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiResponse(CartDto, { objectName: 'cart' })
  @PCode('CART_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get')
  async get(@Req() req) {
    const user: UserDetailsDto = req.user;
    const cart = await this.cartService.get(user.id);
    return MapperUtil.toDto(cart, CartDto);
  }

  @ApiResponseNoData({ type: 'Add cart item successfully' })
  @PCode('CART_A_I')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('add-item')
  async addItem(@Req() req, @Body() form: AddItemForm) {
    const user: UserDetailsDto = req.user;
    return await this.cartService.addItem(form, user.id);
  }
}
