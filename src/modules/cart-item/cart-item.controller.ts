import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { JwtAuthGuard } from '../auth/guards';
import { UpdateCartItemForm } from './forms';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async addItem(@Body() form: UpdateCartItemForm) {
    return await this.cartItemService.update(form);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.cartItemService.delete(id);
  }
}
