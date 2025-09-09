import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards';
import { UserDetailsDto } from '../auth/dtos';
import { MapperUtil } from '@/utils';
import { CartDto } from './dtos';
import { AddItemForm } from './forms';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async get(@Req() req) {
    const user: UserDetailsDto = req.user;
    const cart = await this.cartService.get(user.id);
    return MapperUtil.toDto(cart, CartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-item')
  async addItem(@Body() form: AddItemForm) {
    return await this.cartService.addItem(form);
  }
}
