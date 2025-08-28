import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export * from './roles.decorator';

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

export const EmailDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required,
      type: String,
      description: `${name} (email) field`,
      example: 'example@gmail.com',
    }),
    IsEmail({}, { message: `${name} must be a valid email` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()]),
  );
};
