import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { UpdateCartItemForm } from './forms';
import { PCode } from '@/common/decorators';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @PCode('CART_I_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async addItem(@Body() form: UpdateCartItemForm) {
    return await this.cartItemService.update(form);
  }

  @PCode('CART_I_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.cartItemService.delete(id);
  }
}
