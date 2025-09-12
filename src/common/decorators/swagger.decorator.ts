import 'reflect-metadata';
import {
  ApiPaginatedDataDto,
  ApiResponseListDto,
  ApiResponseNoDataDto
} from '@/common/dtos';
import { ApiResponseDto } from '@/common/dtos/api-response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

function generateExampleFromDto(dto: any): Record<string, any> {
  const instance = new dto();
  const example: Record<string, any> = {};

  // Lấy tất cả property từ prototype
  const keys = Object.getOwnPropertyNames(new dto());

  for (const key of keys) {
    const type = Reflect.getMetadata('design:type', dto.prototype, key);

    if (!type) {
      example[key] = {};
      continue;
    }

    switch (type.name) {
      case 'String':
        example[key] = 'string';
        break;
      case 'Number':
      case 'BigInt':
        example[key] = 0;
        break;
      case 'Boolean':
        example[key] = true;
        break;
      case 'Date':
        example[key] = new Date().toISOString();
        break;
      default:
        example[key] = {};
    }
  }

  return example;
}

export function ApiListResponse<TModel extends Type<any>>(
  item: TModel,
  options?: { objectName?: string }
) {
  const example = generateExampleFromDto(item);

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
