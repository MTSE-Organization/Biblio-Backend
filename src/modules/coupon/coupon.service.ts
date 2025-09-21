import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coupon } from '@/models/coupon.model';
import { CreateCouponForm, FilterCouponForm, UpdateCouponForm } from './forms';
import { NotFoundException } from '@/common/exceptions';
import { Constant, ErrorCode } from '@/constants';
import { Op } from 'sequelize';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon)
    private readonly couponRepository: typeof Coupon
  ) {}

  async create(form: CreateCouponForm) {
    await this.checkCodeExists(form.code);
    const data = { ...form };
    await this.couponRepository.create(data);
    return { message: 'Create coupon successfully' };
  }

  async findAll(
    query: FilterCouponForm
  ): Promise<{ coupons: Coupon[]; count: number }> {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.couponRepository.findAndCountAll({
      where: query.getFilter(),
      offset,
      limit
    });
    return { coupons: rows, count };
  }

  async findById(id: bigint) {
    const coupon = await this.couponRepository.findByPk(id);
    if (!coupon) {
      throw new NotFoundException(
        'Coupon not found',
        ErrorCode.COUPON_ERROR_NOT_FOUND
      );
    }
    return coupon;
  }

  async update(form: UpdateCouponForm) {
    const coupon = await this.findById(form.id);
    if (form.code) {
      await this.checkCodeExists(form.code, form.id);
    }
    await coupon.update(form);
    return { message: 'Update coupon successfully' };
  }

  async delete(id: bigint) {
    const coupon = await this.findById(id);
    await coupon.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete coupon successfully' };
  }

  async recover(id: bigint) {
    const coupon = await this.findById(id);
    await coupon.update({ status: Constant.STATUS_ACTIVE });
    return { message: 'Recover coupon successfully' };
  }

  async checkCodeExists(code: string, excludeId?: bigint): Promise<void> {
    const where: any = { code };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    const existingCoupon = await this.couponRepository.findOne({ where });
    if (existingCoupon) {
      throw new NotFoundException(
        'Coupon code already exists',
        ErrorCode.COUPON_CODE_ALREADY_EXISTS
      );
    }
  }
}
