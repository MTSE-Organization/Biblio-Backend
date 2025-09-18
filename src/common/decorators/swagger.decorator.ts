import 'reflect-metadata';
import {
  ApiPaginatedDataDto,
  ApiResponseListDto,
  ApiResponseNoDataDto
} from '@/common/dtos';
import { ApiResponseDto } from '@/common/dtos/api-response.dto';
import { applyDecorators, Type as NestJsType } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';

function generateExampleFromDto(dto: any, depth = 0): any {
  if (!dto || depth > 5) return null;

  const example: any = {};
  const instance = new dto();
  const prototype = dto.prototype;

  const keys = [
    ...new Set([
      ...Object.getOwnPropertyNames(instance),
      ...Object.getOwnPropertyNames(prototype)
    ])
  ].filter((k) => k !== 'constructor');

  for (const key of keys) {
    const type = Reflect.getMetadata('design:type', prototype, key);
    const typeMetadata = defaultMetadataStorage.findTypeMetadata(dto, key);

    if (!type) {
      example[key] = null;
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
      case 'Array':
        if (typeMetadata?.typeFunction) {
          example[key] = [
            generateExampleFromDto(typeMetadata.typeFunction(), depth + 1)
          ];
        } else {
          example[key] = [];
        }
        break;
      default:
        if (typeof type === 'function' && type.prototype) {
          example[key] = generateExampleFromDto(type, depth + 1);
        } else {
          example[key] = null;
        }
    }
  }

  return example;
}

export function ApiListResponse<TModel extends NestJsType<any>>(
  item: TModel,
  options?: { objectName?: string; message?: string }
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
      description:
        options?.message ??
        (options?.objectName
          ? `Get list ${options.objectName} successfully`
          : 'Get list successfully'),
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

export function ApiResponse<TModel extends NestJsType<any>>(
  model: TModel,
  options?: { objectName: string; message?: string }
) {
  const example = generateExampleFromDto(model);

  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description:
        options?.message ??
        (options?.objectName
          ? `Get ${options.objectName} successfully`
          : 'Get successfully'),
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
  type?: string;
  message?: string;
}) {
  let newMessage = options?.message || 'Success';

  if (options?.objectName && options?.type) {
    switch (options.type) {
      case 'create':
        newMessage = `Create ${options.objectName} successfully`;
        break;
      case 'update':
        newMessage = `Update ${options.objectName} successfully`;
        break;
      case 'delete':
        newMessage = `Delete ${options.objectName} successfully`;
        break;
      case 'update-ordering':
        newMessage = `Update ordering ${options.objectName} successfully`;
        break;
    }
  }

  return applyDecorators(
    ApiExtraModels(ApiResponseNoDataDto),
    ApiOkResponse({
      description: newMessage,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseNoDataDto) },
          {
            properties: {
              message: { example: newMessage }
            },
            required: ['result', 'message', 'date', 'path', 'takenTime']
          }
        ]
      }
    })
  );
}
