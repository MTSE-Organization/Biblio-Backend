import { Injectable } from '@nestjs/common';
import { CreateGroupForm, FilterGroupForm, UpdateGroupForm } from './forms';
import { Group, Permission } from '@/models';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { PermissionService } from '../permission/permission.service';
import { ErrorCode } from '@/constants/error-code.constant';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private readonly groupRepository: typeof Group,
    private readonly permissionService: PermissionService,
  ) {}

  async create(form: CreateGroupForm) {
    const { name, permissionIds, ...data } = form;
    if (await this.existsBy('name', name)) {
      throw new BadRequestException(
        'Group name exists',
        ErrorCode.GROUP_ERROR_NAME_EXISTS,
      );
    }
    const permissions = await this.permissionService.findByIds(permissionIds);
    const group = await this.groupRepository.create({ name, ...data });
    await group.$set('permissions', permissions);
    return { message: 'Create group success' };
  }

  async list(
    query: FilterGroupForm,
  ): Promise<{ groups: Group[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const filter = query.getFilter();
    const { rows, count } = await this.groupRepository.findAndCountAll({
      include: [{ model: Permission, through: { attributes: [] } }],
      limit: size,
      offset: skip,
      where: filter,
    });
    return { groups: rows, count };
  }

  async findById(id: bigint) {
    const group = await this.groupRepository.findByPk(id, {
      include: [{ model: Permission, through: { attributes: [] } }],
    });
    if (!group) {
      throw new NotFoundException(
        'Group not found',
        ErrorCode.GROUP_ERROR_NOT_FOUND,
      );
    }
    return group;
  }

  async update(form: UpdateGroupForm) {
    const { id, name, permissionIds, ...data } = form;
    const group = await this.findById(id);

    if (name !== group.name && (await this.existsBy('name', name))) {
      throw new BadRequestException(
        'Group name exists',
        ErrorCode.GROUP_ERROR_NAME_EXISTS,
      );
    }

    const permissions = await this.permissionService.findByIds(permissionIds);
    console.log(permissionIds);

    await group.update({ name, ...data });
    await group.$set('permissions', permissions);
    return { message: 'Update group success' };
  }

  async deleteById(id: bigint) {
    const group = await this.findById(id);
    const accountCount = await group.$count('accounts');
    if (accountCount > 0) {
      throw new BadRequestException(
        'Group is in use by accounts, cannot delete',
        ErrorCode.GROUP_ERROR_IN_USED,
      );
    }
    await group.destroy();
    return { message: 'Delete group successfully' };
  }

  async findByName(name: string) {
    const group = await this.groupRepository.findOne({ where: { name } });
    if (!group) {
      throw new NotFoundException(
        'Group not found',
        ErrorCode.GROUP_ERROR_NOT_FOUND,
      );
    }
    return group;
  }

  async existsBy(field: keyof Group, value: any): Promise<boolean> {
    const count = await this.groupRepository.count({
      where: { [field]: value },
    });
    return count > 0;
  }
}
