import { Product } from '@/models/product.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductForm } from './forms';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
  ) {}

  async create(form: CreateProductForm) {
    const data = { slug: form.name, ...form };
    await this.productRepository.create(data);
    return { message: 'Create product successfully' };
  }
}
