import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateAddressForm,
  UpdateAddressForm,
  FilterAddressForm,
  GetShippingFeeForm
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { AccountService } from '@/modules/account/account.service';
import { Address } from '@/models';
import { Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderItemService } from '../order/order-item.service';

@Injectable()
export class AddressService {
  private readonly token: string;
  private readonly openApi: string;
  private readonly shippingFeeEndpoint: string;
  private readonly pickAddress: string;
  private readonly pickStreet: string;
  private readonly pickDistrict: string;
  private readonly pickProvince: string;

  constructor(
    @InjectModel(Address)
    private readonly addressRepository: typeof Address,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => OrderItemService))
    private readonly orderItemService: OrderItemService
  ) {
    this.token = this.configService.get<string>('TOKEN')!;
    this.openApi = this.configService.get<string>('OPEN_API')!;
    this.shippingFeeEndpoint = this.configService.get<string>(
      'SHIPPING_FEE_ENDPOINT'
    )!;
    this.pickAddress = this.configService.get<string>('PICK_ADDRESS')!;
    this.pickStreet = this.configService.get<string>('PICK_STREET')!;
    this.pickDistrict = this.configService.get<string>('PICK_DISTRICT')!;
    this.pickProvince = this.configService.get<string>('PICK_PROVINCE')!;
  }

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
        ErrorCode.ADDRESS_ERROR_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_ERROR_INVALID
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
        if (!address.isDefault) {
          await this.resetDefault(accountId);
        }
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
        ErrorCode.ADDRESS_ERROR_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_ERROR_INVALID
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
        ErrorCode.ADDRESS_ERROR_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_ERROR_INVALID
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
        ErrorCode.ADDRESS_ERROR_NOT_FOUND
      );
    }

    if (address.accountId !== accountId) {
      throw new BadRequestException(
        'Address invalid',
        ErrorCode.ADDRESS_ERROR_INVALID
      );
    }

    return address;
  }

  async findByAccountIdAndDefault(accountId: bigint): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { accountId, isDefault: true }
    });

    if (!address) {
      throw new NotFoundException(
        'Adress not found',
        ErrorCode.ADDRESS_ERROR_NOT_FOUND
      );
    }

    return address;
  }

  async getShippingFee(
    form: GetShippingFeeForm,
    accountId: bigint
  ): Promise<number> {
    const [address, weight] = await Promise.all([
      this.findById(form.addressId, accountId),
      this.orderItemService.calculateTotalWeight(form.orderId)
    ]);

    const params = {
      pick_address: this.pickAddress,
      pick_street: this.pickStreet,
      pick_district: this.pickDistrict,
      pick_province: this.pickProvince,
      address: address.detail,
      ward: address.ward,
      district: address.district,
      province: address.city,
      weight
    };

    const headers = {
      Token: this.token
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get<Record<string, any>>(
          this.openApi + this.shippingFeeEndpoint,
          {
            headers,
            params
          }
        )
      );

      const body = response.data;
      console.log(body);
      console.log(body?.fee?.options?.shipMoney);

      if (!body?.fee?.options?.shipMoney) {
        throw new BadRequestException('Failed to calculate shipping fee');
      }

      return body?.fee?.options?.shipMoney as number;
    } catch (err) {
      if (err.response) {
        console.error('Shipping fee request failed:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      } else {
        console.error('Shipping fee unknown error:', err);
      }

      throw new BadRequestException(
        'Shipping fee request failed: ' +
          (err.response?.data?.message || err.message)
      );
    }
  }

  async calculateShippingFee(
    address: Address,
    weight: number = 1000
  ): Promise<number> {
    const params = {
      pick_address: this.pickAddress,
      pick_street: this.pickStreet,
      pick_district: this.pickDistrict,
      pick_province: this.pickProvince,
      address: address.detail,
      ward: address.ward,
      district: address.district,
      province: address.city,
      weight
    };

    const headers = {
      Token: this.token
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get<Record<string, any>>(
          this.openApi + this.shippingFeeEndpoint,
          {
            headers,
            params
          }
        )
      );

      const body = response.data;

      if (!body?.fee?.options?.shipMoney) {
        throw new BadRequestException('Failed to calculate shipping fee');
      }

      return body?.fee?.options?.shipMoney as number;
    } catch (err) {
      if (err.response) {
        console.error('Shipping fee request failed:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      } else {
        console.error('Shipping fee unknown error:', err);
      }

      throw new BadRequestException(
        'Shipping fee request failed: ' +
          (err.response?.data?.message || err.message)
      );
    }
  }
}
