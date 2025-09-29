import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '@/models/product.model';
import { CategoryModule } from '../category/category.module';
import { PublisherModule } from '../publisher/publisher.module';
import { ContributorModule } from '../contributor/contributor.module';
import { ElasticSearchModule } from '../elastic-search/elastic-search.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => CategoryModule),
    PublisherModule,
    ContributorModule,
    ElasticSearchModule
  ],
  exports: [ProductService]
})
export class ProductModule {}
