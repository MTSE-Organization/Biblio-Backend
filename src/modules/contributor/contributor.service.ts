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

@Injectable()
export class ContributorService {
  constructor(
    @InjectModel(Contributor)
    private readonly contributorRepository: typeof Contributor
  ) {}

  async create(form: CreateContributorForm) {
    const data = { ...form };
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

  async update(form: UpdateContributorForm) {
    const contributor = await this.findById(form.id);
    await contributor.update(form);
    return { message: 'Update contributor successfully' };
  }

  async delete(id: bigint) {
    const contributor = await this.findById(id);
    await contributor.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete contributor successfully' };
  }
}
