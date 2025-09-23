import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

export * from './pcode.decorator';
export * from './product-variant-condition.decorator';
export * from './product-variant-format.decorator';
export * from './swagger.decorator';
export * from './order-status.decorator';
export * from './payment-method.decorator';

export const StringDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: String,
      description: `${name} field`
    }),
    IsString({ message: `${name} must be a string` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};

export const IntDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Number,
      description: `${name} field`
    }),
    IsInt({ message: `${name} must be an integer` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};

export const NumberDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Number,
      description: `${name} field`
    }),
    IsNumber({}, { message: `${name} must be a number` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};

export const BooleanDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Boolean,
      description: `${name} field`
    }),
    Transform(({ value }) => {
      if (typeof value === 'boolean') return value;
      if (value === 'true' || value === '1' || value === 1) return true;
      if (value === 'false' || value === '0' || value === 0) return false;
      return value as boolean;
    }),
    IsBoolean({ message: `${name} must be a boolean` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};

export const EmailDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required,
      type: String,
      description: `${name} (email) field`,
      example: 'example@gmail.com'
    }),
    IsEmail({}, { message: `${name} must be a valid email` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};

export const BigIntDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: BigInt,
      description: `${name} field`
    }),
    Transform(({ value }) => BigInt(value)),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};

@ValidatorConstraint({ name: 'isBigIntArray', async: false })
class IsBigIntArray implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (value === null || value === undefined) return true; // optional
    if (!Array.isArray(value)) return false;
    try {
      return value.every((v) => {
        if (v === null || v === undefined) return false;
        BigInt(v); // convert để test
        return true;
      });
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return 'All elements must be valid integers';
  }
}

export const BigIntArrayDecorator = (
  name: string,
  required = false,
  allowEmpty = true
) => {
  const decorators = [
    ApiProperty({
      required,
      type: [String],
      description: `${name} field`
    }),
    Transform(({ value }: { value: any }) => {
      if (!value) return value as unknown;
      const arr = Array.isArray(value) ? value : [value];
      return arr.map((v) => BigInt(v));
    }),
    IsArray({ message: `${name} must be an array` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()]),
    Validate(IsBigIntArray, {
      message: `Each element of ${name} must be a valid integer`
    })
  ];

  if (!allowEmpty) {
    decorators.push(ArrayMinSize(1, { message: `${name} cannot empty` }));
  }

  return applyDecorators(...decorators);
};

export const DateDecorator = (name: string, required: boolean = false) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: String,
      format: 'date-time',
      description: `${name} field`
    }),
    Type(() => Date),
    IsDate({ message: `${name} must be a valid date` }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};
