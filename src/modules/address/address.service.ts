import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from '@/models/address';
import {
  CreateAddressForm,
  UpdateAddressForm,
  FilterAddressForm
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { AccountService } from '@/modules/account/account.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private readonly addressRepository: typeof Address,

    private readonly accountService: AccountService
  ) {}

  async create(form: CreateAddressForm) {
    const data = { ...form };

    await this.accountService.findById(data.accountId);

    if (form.isDefault) {
      await this.resetDefault(data.accountId);
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

    await this.accountService.findById(address.accountId);

    if (form.isDefault) {
      await this.resetDefault(address.accountId);
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

  async findAll(
    form: FilterAddressForm
  ): Promise<{ addresses: Address[]; count: number }> {
    const { page, size } = form;
    const offset = page * size;

    const { rows, count } = await this.addressRepository.findAndCountAll({
      where: form.getFilter(),
      order: [
        ['isDefault', 'DESC'],
        ['created_date', 'DESC']
      ],
      offset,
      limit: size
    });

    return { addresses: rows, count };
  }

  async setDefault(id: bigint) {
    const address = await this.addressRepository.findByPk(id);
    if (!address) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
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
}
