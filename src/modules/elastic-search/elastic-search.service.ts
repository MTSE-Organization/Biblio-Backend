import { Client } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ElasticSearchService {
  constructor(@Inject('ELASTIC_CLIENT') private readonly client: Client) {}

  async createIndex(index: string, mapping: Record<string, any>) {
    const exists = await this.client.indices.exists({ index });
    if (!exists) {
      await this.client.indices.create({
        index,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0
          },
          ...mapping
        }
      });
    }
  }

  async bulkInsert(index: string, docs: Record<string, any>[]) {
    if (!docs || docs.length === 0) {
      return { indexed: 0, errors: false };
    }

    const body = docs.flatMap((doc) => [
      { update: { _index: index, _id: String(doc.id) } },
      { doc: doc, doc_as_upsert: true }
    ]);

    const result = await this.client.bulk({ refresh: true, body });

    if (result.errors) {
      console.error(`Bulk insert errors in [${index}]`, result.items);
    } else {
      console.log(`Indexed ${docs.length} docs into [${index}]`);
    }

    return { indexed: docs.length, errors: result.errors };
  }

  async search(index: string, body: Record<string, any>) {
    const result = await this.client.search({
      index,
      track_total_hits: true,
      ...body
    });

    const hits = result.hits.hits.map((h) => h._source);
    const count =
      (result.hits.total as estypes.SearchTotalHits)?.value ??
      (result.hits.total as number) ??
      0;

    return { hits, count };
  }

  async insert(index: string, doc: Record<string, any>) {
    if (!doc) {
      return { indexed: 0, errors: true };
    }

    const result = await this.client.index({
      index,
      id: String(doc.id),
      document: doc,
      refresh: true
    });

    if (result.result !== 'created' && result.result !== 'updated') {
      console.error(`Insert doc error in [${index}]`, result);
    } else {
      console.log(`Indexed doc [${doc.id}] into [${index}]`);
    }

    return { indexed: 1, errors: false };
  }

  async update(index: string, id: string, doc: Record<string, any>) {
    return await this.client.update({
      index,
      id: String(id),
      doc
    });
  }

  async delete(index: string, id: string | number) {
    return await this.client.delete({
      index,
      id: String(id),
      refresh: true
    });
  }
}
