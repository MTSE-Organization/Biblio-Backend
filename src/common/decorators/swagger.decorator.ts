import 'reflect-metadata';
import {
  ApiPaginatedDataDto,
  ApiResponseListDto,
  ApiResponseNoDataDto
} from '@/common/dtos';
import { ApiResponseDto } from '@/common/dtos/api-response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

function generateExampleFromDto(dto: any, depth = 0): Record<string, any> {
  if (depth > 5) {
    return {};
  }

  const instance = new dto();
  const example: Record<string, any> = {};

  const keys = Object.getOwnPropertyNames(instance);

  const prototype = dto.prototype;
  const prototypeKeys = Object.getOwnPropertyNames(prototype);
  const allKeys = [...new Set([...keys, ...prototypeKeys])].filter(
    (key) => key !== 'constructor'
  );

  for (const key of allKeys) {
    const type = Reflect.getMetadata('design:type', prototype, key);
    const typeMetadata = Reflect.getMetadata(
      'design:paramtypes',
      prototype,
      key
    );

    const transformType = Reflect.getMetadata(
      'design:transform_type',
      prototype,
      key
    );

    if (!type) {
      if (key.toLowerCase().includes('id')) {
        example[key] = 0;
      } else if (key.toLowerCase().includes('name')) {
        example[key] = 'string';
      } else if (key.toLowerCase().includes('date')) {
        example[key] = new Date().toISOString();
      } else {
        example[key] = 'string';
      }
      continue;
    }

    switch (type.name) {
      case 'String':
        example[key] = 'string';
        break;
      case 'Number':
        example[key] = 0;
        break;
      case 'BigInt':
        example[key] = 0;
        break;
      case 'Boolean':
        example[key] = true;
        break;
      case 'Date':
        example[key] = new Date().toISOString();
        break;
      case 'Array': {
        const arrayElementType =
          transformType || getArrayElementType(prototype, key);
        if (arrayElementType) {
          try {
            const elementExample = generateExampleFromDto(
              arrayElementType,
              depth + 1
            );
            example[key] = [elementExample];
          } catch (error) {
            example[key] = [generateGenericExample(key)];
          }
        } else {
          example[key] = [generateGenericExample(key)];
        }
        break;
      }
      case 'Object':
        example[key] = {};
        break;
      default:
        if (transformType) {
          try {
            example[key] = generateExampleFromDto(transformType, depth + 1);
          } catch (error) {
            example[key] = generateGenericExample(key);
          }
        } else if (typeof type === 'function') {
          try {
            example[key] = generateExampleFromDto(type, depth + 1);
          } catch (error) {
            example[key] = generateGenericExample(key);
          }
        } else {
          example[key] = generateGenericExample(key);
        }
    }
  }

  return example;
}

function getArrayElementType(prototype: any, propertyKey: string): any {
  const designType = Reflect.getMetadata('design:type', prototype, propertyKey);
  const transformMetadata = Reflect.getMetadata(
    'class-transformer:transform',
    prototype,
    propertyKey
  );

  if (transformMetadata && transformMetadata.type) {
    return transformMetadata.type;
  }

  const typeArgs = Reflect.getMetadata(
    'design:paramtypes',
    prototype,
    propertyKey
  );
  if (typeArgs && typeArgs[0]) {
    return typeArgs[0];
  }

  return null;
}

function generateGenericExample(key: string): any {
  const lowerKey = key.toLowerCase();

  if (lowerKey.includes('id')) {
    return 0;
  } else if (lowerKey.includes('name') || lowerKey.includes('title')) {
    return 'string';
  } else if (lowerKey.includes('date') || lowerKey.includes('time')) {
    return new Date().toISOString();
  } else if (
    lowerKey.includes('price') ||
    lowerKey.includes('amount') ||
    lowerKey.includes('count')
  ) {
    return 0;
  } else if (
    lowerKey.includes('is') ||
    lowerKey.includes('has') ||
    lowerKey.includes('can')
  ) {
    return true;
  } else if (
    lowerKey.includes('url') ||
    lowerKey.includes('path') ||
    lowerKey.includes('link')
  ) {
    return 'https://example.com';
  } else if (lowerKey.includes('email')) {
    return 'example@email.com';
  } else if (lowerKey.includes('phone')) {
    return '+1234567890';
  } else if (
    lowerKey.includes('image') ||
    lowerKey.includes('photo') ||
    lowerKey.includes('picture')
  ) {
    return {
      id: 0,
      url: 'https://example.com/image.jpg',
      altText: 'Example image'
    };
  }

  return 'string';
}

export function ApiListResponse<TModel extends Type<any>>(
  item: TModel,
  options?: { objectName?: string }
) {
  let example: any;

  try {
    example = generateExampleFromDto(item);
  } catch (error) {
    console.warn(`Failed to generate example for ${item.name}:`, error);
    example = {
      id: 0,
      name: 'string',
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
  }

  return applyDecorators(
    ApiExtraModels(ApiResponseListDto, ApiPaginatedDataDto, item),
    ApiOkResponse({
      description: options?.objectName
        ? `Get list ${options.objectName} successfully`
        : 'Get list successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseListDto) },
          {
            properties: {
              message: {
                example: options?.objectName
                  ? `Get list ${options.objectName.toLowerCase()} successfully`
                  : 'Get list successfully'
              },
              data: {
                allOf: [
                  { $ref: getSchemaPath(ApiPaginatedDataDto) },
                  {
                    properties: {
                      content: {
                        type: 'array',
                        items: { $ref: getSchemaPath(item) },
                        example: [example]
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    })
  );
}

export function ApiResponse<TModel extends Type<any>>(
  model: TModel,
  options?: { objectName: string }
) {
  const example = generateExampleFromDto(model);

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description: options?.objectName
        ? `Get ${options.objectName} successfully`
        : 'Get successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                allOf: [{ $ref: getSchemaPath(model) }],
                example
              },
              message: {
                example: options?.objectName
                  ? `Get ${options.objectName} successfully`
                  : 'Get successfully'
              }
            }
          }
        ]
      }
    })
  );
}

export function ApiResponseNoData(options?: {
  objectName?: string;
  type: 'create' | 'update' | 'delete' | 'update-ordering';
}) {
  let message = 'Success';

  if (options?.objectName && options?.type) {
    switch (options.type) {
      case 'create':
        message = `Create ${options.objectName} successfully`;
        break;
      case 'update':
        message = `Update ${options.objectName} successfully`;
        break;
      case 'delete':
        message = `Delete ${options.objectName} successfully`;
        break;
      case 'update-ordering':
        message = `Update ordering ${options.objectName} successfully`;
        break;
    }
  }

  return applyDecorators(
    ApiExtraModels(ApiResponseNoDataDto),
    ApiOkResponse({
      description: message,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseNoDataDto) },
          {
            properties: {
              message: { example: message }
            },
            required: ['result', 'message', 'date', 'path', 'takenTime']
          }
        ]
      }
    })
  );
}
