import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coupon } from '@/models/coupon.model';
import { CreateCouponForm, FilterCouponForm, UpdateCouponForm } from './forms';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { Constant, ErrorCode } from '@/constants';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '@/models';
import bigDecimal from 'js-big-decimal';

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

  async recover(id: bigint) {
    const coupon = await this.findById(id);
    if (!coupon)
      throw new BadRequestException(
        'Coupon not found',
        ErrorCode.COUPON_ERROR_NOT_FOUND
      );
    await coupon.update({ status: Constant.STATUS_ACTIVE });
    return { message: 'Recover coupon successfully' };
  }

  async delete(id: bigint) {
    const coupon = await this.findById(id);
    await coupon.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete coupon successfully' };
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
        ErrorCode.COUPON_ERROR_CODE_EXISTED
      );
    }
  }

  async findByIds(ids: bigint[]): Promise<Coupon[]> {
    const coupons = await this.couponRepository.findAll({
      where: { id: ids }
    });
    return coupons;
  }

  async findByOrderId(
    orderId: bigint,
    transaction?: Transaction
  ): Promise<Coupon[]> {
    return await this.couponRepository.findAll({
      include: [
        {
          model: Order,
          where: { id: orderId }
        }
      ],
      transaction
    });
  }

  checkValid(coupons: Coupon[]) {
    if (coupons.length > 2) {
      return false;
    }
    const now = new Date();
    const kinds = new Set<number>();
    for (const coupon of coupons) {
      if (
        coupon.validFrom > now ||
        coupon.validTo < now ||
        coupon.status !== Constant.STATUS_ACTIVE ||
        coupon.quantity <= 0
      ) {
        return false;
      }
      if (kinds.has(coupon.kind)) {
        return false;
      }
      kinds.add(coupon.kind);
    }
    return true;
  }

  async decreaseQuantity(coupons: Coupon[], t?: Transaction) {
    const ids = coupons.map((c) => {
      if (c.quantity <= 0) {
        throw new BadRequestException(
          `Coupon ${c.code} invalid`,
          ErrorCode.COUPON_ERROR_INVALID
        );
      }
      return c.id;
    });

    await this.couponRepository.update(
      { quantity: Sequelize.literal('quantity - 1') },
      { where: { id: ids }, transaction: t }
    );
  }

  getCouponAmount(baseAmount: string, type: number, value: string): string {
    let discount = '0';
    console.log({ baseAmount });

    if (type === Constant.COUPON_TYPE_FIXED) {
      discount = value;
    } else if (type === Constant.COUPON_TYPE_PERCENTAGE) {
      discount = bigDecimal
        .divide(bigDecimal.multiply(baseAmount, value), 100)
        .toString();
    }

    return bigDecimal.compareTo(discount, baseAmount) > 0
      ? baseAmount
      : discount;
  }
}
