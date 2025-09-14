import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contributor } from '@/models/contributor';
import {
  CreateContributorForm,
  FilterContributorForm,
  UpdateContributorForm
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { Constant } from '@/constants/constant';
import { where } from 'sequelize';

@Injectable()
export class ContributorService {
  constructor(
    @InjectModel(Contributor)
    private readonly contributorRepository: typeof Contributor
  ) {}

  async create(form: CreateContributorForm, kind: number) {
    const data = { ...form, kind };
    await this.contributorRepository.create(data);
    return { message: 'Create contributor successfully' };
  }

  async findAll(
    query: FilterContributorForm
  ): Promise<{ contributors: Contributor[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const { rows, count } = await this.contributorRepository.findAndCountAll({
      where: query.getFilter(),
      offset: skip,
      limit: size
    });

    return { contributors: rows, count };
  }

  async findById(id: bigint): Promise<Contributor> {
    const contributor = await this.contributorRepository.findByPk(id);
    if (!contributor) {
      throw new NotFoundException(
        'Contributor not found',
        ErrorCode.CONTRIBUTOR_ERROR_NOT_FOUND
      );
    }
    return contributor;
  }

  async findByIdAndKind(id: bigint, kind: number): Promise<Contributor> {
    const contributor = await this.contributorRepository.findOne({
      where: { id, kind }
    });
    if (!contributor) {
      throw new NotFoundException(
        'Contributor not found',
        ErrorCode.CONTRIBUTOR_ERROR_NOT_FOUND
      );
    }
    return contributor;
  }

  async findByIdAndKindAndStatus(
    id: bigint,
    kind: number,
    status: number
  ): Promise<Contributor> {
    const contributor = await this.contributorRepository.findOne({
      where: { id, kind, status }
    });
    if (!contributor) {
      throw new NotFoundException(
        'Contributor not found',
        ErrorCode.CONTRIBUTOR_ERROR_NOT_FOUND
      );
    }
    return contributor;
  }

  async update(form: UpdateContributorForm, kind: number) {
    const contributor = await this.findByIdAndKind(form.id, kind);
    await contributor.update(form);
    return { message: 'Update contributor successfully' };
  }

  async delete(id: bigint, kind: number) {
    const contributor = await this.findByIdAndKind(id, kind);
    await contributor.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete contributor successfully' };
  }
}
