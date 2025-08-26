import { Category } from '@/models';
import { CreateCategoryForm } from '@/modules/category/form/create-category.form';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryMapper {
  toEntity(dto: CreateCategoryForm): Category {
    return new Category({
      name: dto.name,
      ...(dto.ordering !== undefined && { ordering: dto.ordering }),
      ...(dto.status !== undefined && { status: dto.status }),
    });
  }

  toDto(entity: Category): Category {
    return entity;
  }
}
