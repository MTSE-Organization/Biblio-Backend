import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Publisher } from '@/models/publisher.model';
import {
  CreatePublisherForm,
  FilterPublisherForm,
  UpdatePublisherForm
} from './forms';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { Constant, ErrorCode } from '@/constants';
import { FileService } from '../file/file.service';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher)
    private readonly publisherRepository: typeof Publisher,

    private readonly fileService: FileService
  ) {}

  async create(form: CreatePublisherForm) {
    const data = { ...form };

    await this.publisherRepository.create(data);
    return { message: 'Create publisher successfully' };
  }

  async findAll(
    query: FilterPublisherForm
  ): Promise<{ publishers: Publisher[]; count: number }> {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.publisherRepository.findAndCountAll({
      where: query?.getFilter(),
      offset: offset,
      limit: limit
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

  async findByIdAndStatus(id: bigint, status: number): Promise<Publisher> {
    const publisher = await this.publisherRepository.findOne({
      where: { id, status }
    });
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

    if (publisher.logoPath && publisher.logoPath !== form.logoPath) {
      await this.fileService.deleteFile(publisher.logoPath);
    }

    await publisher.update(form);
    return { message: 'Update publisher successfully' };
  }

  async delete(id: bigint) {
    const publisher = await this.findById(id);
    await publisher.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete publisher successfully' };
  }

  async recover(id: bigint) {
    const publisher = await this.findById(id);
    if (!publisher)
      throw new BadRequestException(
        'Publisher not found',
        ErrorCode.PUBLISHER_ERROR_NOT_FOUND
      );
    await publisher.update({ status: Constant.STATUS_ACTIVE });
    return { message: 'Recover publisher successfully' };
  }
}
