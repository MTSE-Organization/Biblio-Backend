import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Publisher } from '@/models/publisher';
import {
  CreatePublisherForm,
  FilterPublisherForm,
  UpdatePublisherForm
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { Constant } from '@/constants/constant';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher)
    private readonly publisherRepository: typeof Publisher
  ) {}

  async create(form: CreatePublisherForm) {
    const data = { ...form };

    await this.publisherRepository.create(data);
    return { message: 'Create publisher successfully' };
  }

  async findAll(
    query: FilterPublisherForm
  ): Promise<{ publishers: Publisher[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const { rows, count } = await this.publisherRepository.findAndCountAll({
      offset: skip,
      limit: size
    });

    return { publishers: rows, count };
  }

  async findById(id: bigint): Promise<Publisher> {
    const publisher = await this.publisherRepository.findByPk(id);
    if (!publisher) {
      throw new NotFoundException(
        'Publisher not found',
        ErrorCode.PUBLISHER_ERROR_NOT_FOUND
      );
    }
    return publisher;
  }

  async update(form: UpdatePublisherForm) {
    const publisher = await this.findById(form.id);
    await publisher.update(form);
    return { message: 'Update publisher successfully' };
  }

  async delete(id: bigint) {
    const publisher = await this.findById(id);
    await publisher.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete publisher successfully' };
  }
}
