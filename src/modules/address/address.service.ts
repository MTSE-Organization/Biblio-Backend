import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from '@/models/address';
import { CreateAddressForm, UpdateAddressForm } from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private readonly addressRepository: typeof Address
  ) {}

  async create(form: CreateAddressForm) {
    const data = { ...form };

    if (form.isDefault) {
      await this.removeDefault(data.accountId);
    }
    await this.addressRepository.create(data);
    return { message: 'Address created successfully' };
  }

  async update(form: UpdateAddressForm) {
    const address = await this.addressRepository.findByPk(form.id);
    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (form.isDefault) {
      await this.removeDefault(address.accountId);
    }

    await address.update(form);
    return { message: 'Address updated successfully' };
  }

  async delete(id: bigint) {
    const address = await this.addressRepository.findByPk(id);
    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    await address.destroy();
    return { message: 'Address deleted successfully' };
  }

  async findByAccount(accountId: bigint): Promise<Address[]> {
    return await this.addressRepository.findAll({
      where: { accountId },
      order: [
        ['isDefault', 'DESC'],
        ['created_date', 'DESC']
      ]
    });
  }

  async setDefault(id: bigint) {
    const address = await this.addressRepository.findByPk(id);
    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    await this.removeDefault(address.accountId);
    await address.update({ isDefault: true });

    return { message: 'Set default address successfully' };
  }

  private async removeDefault(accountId: bigint) {
    await this.addressRepository.update(
      { isDefault: false },
      { where: { accountId, isDefault: true } }
    );
  }
}
