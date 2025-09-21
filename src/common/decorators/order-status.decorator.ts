import { Constant } from '@/constants';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export const OrderStatusDecorator = (
  name: string,
  required: boolean = false
) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Number,
      description: `${name} field`
    }),
    IsNumber({}, { message: `${name} must be a number` }),
    IsIn(
      [
        Constant.ORDER_STATUS_CONFIRMED,
        Constant.ORDER_STATUS_PACKING,
        Constant.ORDER_STATUS_SHIPPING,
        Constant.ORDER_STATUS_REFUNDED
      ],
      {
        message: `${name} invalid`
      }
    ),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};
