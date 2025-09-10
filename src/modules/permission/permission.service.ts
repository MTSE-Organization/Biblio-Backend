import { Permission } from '@/models';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreatePermissionForm,
  FilterPermissionForm,
  UpdatePermissionForm
} from './forms';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { PermissionGroupService } from '../permission-group/permission-group.service';
import { PermissionGroup } from '@/models/permission-group.model';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,

    @Inject(forwardRef(() => PermissionGroupService))
    private readonly permissionGroupService: PermissionGroupService
  ) {}

  async create(form: CreatePermissionForm) {
    await this.permissionGroupService.findById(form.permissionGroupId);

    if (await this.existsBy('name', form.name)) {
      throw new BadRequestException(
        'Permission name exists',
        ErrorCode.PERMISSION_ERROR_NAME_EXISTS
      );
    }
    if (await this.existsBy('pCode', form.pCode)) {
      throw new BadRequestException(
        'Permission code exists',
        ErrorCode.PERMISSION_ERROR_CODE_EXISTS
      );
    }
    await this.permissionRepository.create({ ...form });
    return { message: 'Create permission successfully' };
  }

  async update(form: UpdatePermissionForm) {
    const { id, ...data } = form;
    const permission = await this.findById(id);
    if (
      permission.name !== form.name &&
      (await this.existsBy('name', form.name))
    ) {
      throw new BadRequestException(
        'Permission name exists',
        ErrorCode.PERMISSION_ERROR_NAME_EXISTS
      );
    }
    if (
      permission.pCode !== form.pCode &&
      (await this.existsBy('pCode', form.pCode))
    ) {
      throw new BadRequestException(
        'Permission code exists',
        ErrorCode.PERMISSION_ERROR_CODE_EXISTS
      );
    }
    permission.set(data);
    await permission.save();
    return { message: 'Update permission successfully' };
  }

  async delete(id: bigint) {
    const permission = await this.findById(id);
    await permission.destroy();
    return { message: 'Delete permission successfully' };
  }

  async findAll(
    query: FilterPermissionForm
  ): Promise<{ permissions: Permission[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const { rows, count } = await this.permissionRepository.findAndCountAll({
      limit: size,
      offset: skip,
      include: [{ model: PermissionGroup }]
    });
    return { permissions: rows, count };
  }

  async findById(id: bigint): Promise<Permission> {
    const permission = await this.permissionRepository.findByPk(id, {
      include: [{ model: PermissionGroup }]
    });
    if (!permission) {
      throw new NotFoundException(
        'Permission not found',
        ErrorCode.PERMISSION_ERROR_NOT_FOUND
      );
    }
    return permission;
  }

  async findByIds(ids: bigint[]): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findAll({
      where: { id: ids }
    });
    return permissions;
  }

  async existsBy(field: keyof Permission, value: any): Promise<boolean> {
    const count = await this.permissionRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }

  async deleteByGroupPermissionId(permissionGroupId: bigint): Promise<number> {
    const deletedCount = await this.permissionRepository.destroy({
      where: { permission_group_id: permissionGroupId }
    });
    return deletedCount;
  }
}
