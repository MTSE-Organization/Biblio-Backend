import { Product } from '@/models/product.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateProductForm,
  FilterProductForm,
  SearchProductForm,
  UpdateProductForm
} from './forms';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { Category, Contributor, ProductImage, Publisher } from '@/models';
import { CategoryService } from '../category/category.service';
import { MapperUtil, SlugifyUtil } from '@/utils';
import { Constant, ElasticConstant, ErrorCode } from '@/constants';
import { PublisherService } from '../publisher/publisher.service';
import { ContributorService } from '../contributor/contributor.service';
import { Op } from 'sequelize';
import { ElasticSearchService } from '../elastic-search/elastic-search.service';
import { ProductMapping } from '../elastic-search/mappings/product.mapping';
import { ProductMapper } from './product.mapper';
import { CategoryDocDto } from '../category/dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    private readonly publisherService: PublisherService,

    private readonly contributorService: ContributorService,

    private readonly elasticSearchService: ElasticSearchService
  ) {}

  async create(form: CreateProductForm) {
    const { contributorsIds, ...rest } = form;
    const [category, publisher] = await Promise.all([
      this.categoryService.findById(rest.categoryId),
      this.publisherService.findById(rest.publisherId)
    ]);

    const slug = SlugifyUtil.toSlugify(rest.name);
    const data = { slug: slug, ...rest };
    const product = await this.productRepository.create(data);
    const contributors =
      await this.contributorService.findByIds(contributorIds);
    await product.$set('contributors', contributors);

    // build doc product
    const categoryDoc = MapperUtil.toDto(category, CategoryDocDto);
    const doc = ProductMapper.toDocDto(product);
    doc.category = categoryDoc;

    // insert to es
    await this.elasticSearchService.createIndex(
      ElasticConstant.PRODUCT_INDEX,
      ProductMapping
    );
    await this.elasticSearchService.insert(ElasticConstant.PRODUCT_INDEX, doc);

    return { message: 'Create product successfully' };
  }

  async existsBy(field: keyof Product, value: any): Promise<boolean> {
    const count = await this.productRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }

  async update(form: UpdateProductForm) {
    const product = await this.findById(form.id);
    let category: Category | undefined;
    if (product.categoryId !== form.categoryId) {
      category = await this.categoryService.findById(form.categoryId);
      product.categoryId = form.categoryId;
    }
    if (product.publisherId !== form.publisherId) {
      await this.publisherService.findById(form.publisherId);
    }
    const slug = SlugifyUtil.toSlugify(form.name);
    const { contributorIds, ...data } = form;
    await product.update({ slug, ...data });
    const contributors =
      await this.contributorService.findByIds(contributorIds);
    await product.$set('contributors', contributors);

    // build doc product
    const doc = ProductMapper.toDocDto(product);
    if (category) {
      doc.category = MapperUtil.toDto(category, CategoryDocDto);
    }
    // update to es
    await this.elasticSearchService.createIndex(
      ElasticConstant.PRODUCT_INDEX,
      ProductMapping
    );
    await this.elasticSearchService.update(
      ElasticConstant.PRODUCT_INDEX,
      product.id.toString(),
      doc
    );

    return { message: 'Update product successfully' };
  }

  async recover(id: bigint) {
    const product = await this.findByIdAndStatus(id, Constant.STATUS_DELETED);
    if (!product)
      throw new BadRequestException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    await product.update({ status: Constant.STATUS_ACTIVE });

    // build doc product
    const doc = ProductMapper.toDocDto(product);

    // insert to es
    await this.elasticSearchService.createIndex(
      ElasticConstant.PRODUCT_INDEX,
      ProductMapping
    );
    await this.elasticSearchService.insert(ElasticConstant.PRODUCT_INDEX, doc);
    return { message: 'Recover product successfully' };
  }

  async findAll(
    query: FilterProductForm
  ): Promise<{ products: Product[]; count: number }> {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.productRepository.findAndCountAll({
      limit: limit,
      offset: offset,
      where: query.getFilter(),
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        },
        {
          model: Publisher
        }
      ]
    });

    return { products: rows, count };
  }

  async findById(id: bigint): Promise<Product> {
    const product = await this.productRepository.findByPk(id);

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async findDetail(id: bigint, status?: number): Promise<Product> {
    const where: any = { id };
    if (status !== undefined) {
      where.status = status;
    }

    const product = await this.productRepository.findOne({
      where,
      include: [
        { model: Category },
        { model: ProductImage, separate: true, order: [['ordering', 'ASC']] },
        { model: Publisher },
        { model: Contributor, through: { attributes: [] } }
      ]
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async findByIdAndStatus(
    id: bigint,
    status: number = Constant.STATUS_ACTIVE
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, status },
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async delete(id: bigint) {
    const product = await this.findById(id);
    await product.update({ status: Constant.STATUS_DELETED });
    await this.elasticSearchService.delete(
      ElasticConstant.PRODUCT_INDEX,
      product.id.toString()
    );
    return { message: 'Delete product successfully' };
  }

  async findLatest(limit: number = 8) {
    return this.productRepository.findAll({
      where: { status: Constant.STATUS_ACTIVE },
      limit,
      order: [['createdDate', 'DESC']],
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });
  }

  async findBestSeller(limit: number = 6) {
    return this.productRepository.findAll({
      where: { isFeatured: true, status: Constant.STATUS_ACTIVE },
      limit,
      order: [['quantity', 'DESC']],
      include: [{ model: Category }]
    });
  }

  async findTopView(limit: number = 8) {
    return this.productRepository.findAll({
      where: { status: Constant.STATUS_ACTIVE },
      limit,
      order: [['totalViews', 'DESC']],
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });
  }

  async findTopDiscount(limit: number = 4) {
    return this.productRepository.findAll({
      where: { status: Constant.STATUS_ACTIVE },
      limit,
      order: [['discount', 'DESC']],
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });
  }

  async findByCategory(
    productId: bigint,
    limit: number = 8
  ): Promise<{ products: Product[]; count: number }> {
    const product = await this.findByIdAndStatus(productId);

    const { rows, count } = await this.productRepository.findAndCountAll({
      where: {
        categoryId: product.categoryId,
        status: Constant.STATUS_ACTIVE,
        id: { [Op.ne]: product.id }
      },
      limit,
      order: [['createdDate', 'DESC']],
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });

    return { products: rows, count };
  }

  async syncData() {
    const products = await this.productRepository.findAll({
      where: { status: Constant.STATUS_ACTIVE },
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });

    const docs = products.map((p) => ProductMapper.toDocDto(p));

    await this.elasticSearchService.createIndex(
      ElasticConstant.PRODUCT_INDEX,
      ProductMapping
    );

    await this.elasticSearchService.bulkInsert(
      ElasticConstant.PRODUCT_INDEX,
      docs
    );

    return { message: 'Sync data product successfully' };
  }

  async search(form: SearchProductForm) {
    const must: any[] = [];
    const filter: any[] = [];

    if (form.keyword) {
      must.push({
        multi_match: {
          query: form.keyword,
          fields: ['name^2', 'category.name'],
          fuzziness: 'AUTO'
        }
      });
    }

    if (form.minPrice || form.maxPrice) {
      const range: any = {};
      if (form.minPrice) range.gte = form.minPrice;
      if (form.maxPrice) range.lte = form.maxPrice;
      filter.push({ range: { price: range } });
    }

    if (form.ageRating) {
      filter.push({ term: { ageRating: form.ageRating } });
    }
    if (form.language) {
      filter.push({ term: { language: form.language } });
    }
    if (form.categoryId) {
      filter.push({ term: { 'category.id': form.categoryId } });
    }

    const sort: any[] = [];
    if (form.sortBy) {
      sort.push({ [form.sortBy]: { order: form.sortOrder || 'asc' } });
    }

    const { limit, offset } = form.getPagination();

    return await this.elasticSearchService.search('db_book_product', {
      query: {
        bool: {
          must: must.length > 0 ? must : [{ match_all: {} }],
          filter
        }
      },
      sort,
      from: offset,
      size: limit
    });
  }
}
