import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { Logger } from '@nestjs/common';

export const elasticConfig = {
  provide: 'ELASTIC_CLIENT',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Client> => {
    const node = configService.get<string>('ELASTIC_NODE')!;
    const username = configService.get<string>('ELASTIC_USER')!;
    const password = configService.get<string>('ELASTIC_PASSWORD')!;
    const logger = new Logger('Elasticsearch');
    const client = new Client({
      node,
      auth: { username, password }
    });

    try {
      const info = await client.info();
      logger.log(`Connected to Elasticsearch cluster: ${info.cluster_name}`);
    } catch (err) {
      logger.error(
        'Failed to connect to Elasticsearch',
        err.meta?.body || err.message
      );
    }

    return client;
  }
};
