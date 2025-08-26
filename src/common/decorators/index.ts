import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export const StringDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: String,
      description: `${name} field`,
    }),
    IsString({ message: `${name} must be a string` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()]),
  );
};

export const NumberDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Number,
      description: `${name} field`,
    }),
    IsNumber({}, { message: `${name} must be a number` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()]),
  );
};

export const BooleanDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Boolean,
      description: `${name} field`,
    }),
    IsBoolean({ message: `${name} must be a boolean` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()]),
  );
};
