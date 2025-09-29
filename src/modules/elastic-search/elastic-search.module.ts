import { Module } from '@nestjs/common';
import { ElasticSearchService } from './elastic-search.service';
import { elasticConfig } from '@/config';

@Module({
  providers: [elasticConfig, ElasticSearchService],
  exports: [ElasticSearchService]
})
export class ElasticSearchModule {}
