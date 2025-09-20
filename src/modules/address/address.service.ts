import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateAddressForm,
  UpdateAddressForm,
  FilterAddressForm
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { AccountService } from '@/modules/account/account.service';
import { Address } from '@/models';
import { Op } from 'sequelize';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private readonly addressRepository: typeof Address,

    private readonly accountService: AccountService
  ) {}

  async create(form: CreateAddressForm, accountId: bigint) {
    const data = { ...form, accountId };

    await this.accountService.findById(data.accountId);

    const count = await this.addressRepository.count({
      where: { accountId }
    });

    if (count === 0) {
      data.isDefault = true;
    } else {
      if (form.isDefault) {
        await this.resetDefault(accountId);
        data.isDefault = true;
      } else {
        data.isDefault = false;
      }
    }

    await this.addressRepository.create(data);
    return { message: 'Address created successfully' };
  }

  async update(form: UpdateAddressForm, accountId: bigint) {
    const address = await this.addressRepository.findByPk(form.id);

    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_INVALID
      );
    }

    await this.accountService.findById(address.accountId);

    const count = await this.addressRepository.count({
      where: { accountId }
    });

    if (count === 1) {
      form.isDefault = true;
    } else {
      if (form.isDefault) {
        await this.resetDefault(accountId);
      } else if (address.isDefault) {
        const otherAddress = await this.addressRepository.findOne({
          where: { accountId, id: { [Op.ne]: form.id } }
        });

        if (otherAddress) {
          await otherAddress.update({ isDefault: true });
        } else {
          form.isDefault = true;
        }
      }
    }

    await address.update(form);
    return { message: 'Address updated successfully' };
  }

  async delete(id: bigint, accountId: bigint) {
    const address = await this.addressRepository.findByPk(id);

    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_INVALID
      );
    }

    if (address.isDefault) {
      const count = await this.addressRepository.count({
        where: { accountId }
      });

      if (count > 1) {
        const otherAddress = await this.addressRepository.findOne({
          where: { accountId, id: { [Op.ne]: id } }
        });

        if (otherAddress) {
          await otherAddress.update({ isDefault: true });
        }
      }
    }

    await address.destroy();

    const remainingCount = await this.addressRepository.count({
      where: { accountId }
    });
    if (remainingCount === 0) {
      return { message: 'Address deleted successfully' };
    }

    return { message: 'Address deleted successfully' };
  }

  async findAll(
    form: FilterAddressForm,
    accountId: bigint
  ): Promise<{ addresses: Address[]; count: number }> {
    const { limit, offset } = form.getPagination();

    const { rows, count } = await this.addressRepository.findAndCountAll({
      where: { accountId },
      order: [
        ['isDefault', 'DESC'],
        ['created_date', 'DESC']
      ],
      offset: offset,
      limit: limit
    });

    return { addresses: rows, count };
  }

  async setDefault(id: bigint, accountId: bigint) {
    const address = await this.addressRepository.findByPk(id);
    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_INVALID
      );
    }

    await this.resetDefault(address.accountId);
    await address.update({ isDefault: true });

    return { message: 'Set default address successfully' };
  }

  private async resetDefault(accountId: bigint) {
    await this.addressRepository.update(
      { isDefault: false },
      { where: { accountId, isDefault: true } }
    );
  }

  async findById(id: bigint, accountId: bigint): Promise<Address> {
    const address = await this.addressRepository.findByPk(id);

    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_INVALID
      );
    }

    return address;
  }
}
