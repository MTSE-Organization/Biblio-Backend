import { PermissionGroup } from '@/models/permission-group.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreatePermissionGroupForm,
  FilterPermissionGroupForm,
  UpdatePermissionGroupForm
} from './forms';
import { ErrorCode } from '@/constants/error-code.constant';
import { PermissionService } from '../permission/permission.service';
import { BadRequestException, NotFoundException } from '@/common/exceptions';

@Injectable()
export class PermissionGroupService {
  constructor(
    @InjectModel(PermissionGroup)
    private readonly permissionGroupRepository: typeof PermissionGroup,

    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService
  ) {}

  async create(form: CreatePermissionGroupForm) {
    if (await this.existsBy('name', form.name)) {
      throw new BadRequestException(
        'Permission Group name exists',
        ErrorCode.PERMISSION_GROUP_ERROR_NAME_EXISTS
      );
    }
    await this.permissionGroupRepository.create({ ...form });
    return { message: 'Create permission group successfully' };
  }

  async update(form: UpdatePermissionGroupForm) {
    const { id, ...data } = form;
    const permissionGroup = await this.findById(id);
    if (
      permissionGroup.name !== form.name &&
      (await this.existsBy('name', form.name))
    ) {
      throw new BadRequestException(
        'Permission Group name exists',
        ErrorCode.PERMISSION_GROUP_ERROR_NAME_EXISTS
      );
    }
    permissionGroup.set(data);
    await permissionGroup.save();
    return { message: 'Update permission group successfully' };
  }

  async delete(id: bigint) {
    const permissionGroup = await this.findById(id);

    await this.permissionService.deleteByGroupPermissionId(id);

    await permissionGroup.destroy();
    return { message: 'Delete permission group successfully' };
  }

  async findAll(
    query: FilterPermissionGroupForm
  ): Promise<{ permissionGroups: PermissionGroup[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const { rows, count } =
      await this.permissionGroupRepository.findAndCountAll({
        limit: size,
        offset: skip
      });
    return { permissionGroups: rows, count };
  }

  async findById(id: bigint): Promise<PermissionGroup> {
    const permissionGroup = await this.permissionGroupRepository.findByPk(id);
    if (!permissionGroup) {
      throw new NotFoundException(
        'Permission Group not found',
        ErrorCode.PERMISSION_GROUP_ERROR_NOT_FOUND
      );
    }
    return permissionGroup;
  }

  async existsBy(field: keyof PermissionGroup, value: any): Promise<boolean> {
    const count = await this.permissionGroupRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }
}
