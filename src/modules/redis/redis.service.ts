import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async get<T = any>(key: string): Promise<T | null> {
    return (await this.cacheManager.get<T>(key)) ?? null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.cacheManager.set(key, value, ttlSeconds);
    } else {
      await this.cacheManager.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const stream = this.redisClient.scanStream({
      match: `${prefix}*`,
      count: 100
    });
    const promises: Promise<number>[] = [];

    stream.on('data', (keys: string[]) => {
      if (keys.length) {
        promises.push(this.redisClient.del(...keys));
      }
    });

    await new Promise<void>((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
    await Promise.all(promises);
  }

  async getKeysByPrefix(prefix: string): Promise<Set<string>> {
    const stream = this.redisClient.scanStream({
      match: `${prefix}*`,
      count: 100
    });
    const keys = new Set<string>();
    return new Promise((resolve, reject) => {
      stream.on('data', (batch: string[]) => batch.forEach((k) => keys.add(k)));
      stream.on('end', () => resolve(keys));
      stream.on('error', reject);
    });
  }
}
