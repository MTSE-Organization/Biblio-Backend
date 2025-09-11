import { plainToInstance } from 'class-transformer';

export class MapperUtil {
  static toDto<T, V>(instance: T, dtoClass: new () => V): V {
    const plain = (instance as any).get?.({ plain: true }) ?? instance;
    return plainToInstance(dtoClass, plain, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false
    });
  }

  static toDtoList<T, V>(instances: T[], dtoClass: new () => V): V[] {
    return instances.map((instance) => this.toDto(instance, dtoClass));
  }
}
