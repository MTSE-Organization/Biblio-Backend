import { Constant } from '@/constants';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const OrderCmdDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: String,
      description: `${name} field`
    }),
    IsString({ message: `${name} must be a string` }),
    IsIn(
      [
        Constant.CMD_CONFIRM_ORDER,
        Constant.CMD_START_PACKING,
        Constant.CMD_START_SHIPPING,
        Constant.CMD_CONFIRM_REFUNDED
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
