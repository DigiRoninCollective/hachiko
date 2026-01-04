// KV store wrapper for rate limiting
// Supports multiple Redis providers:
// 1. Upstash (Vercel KV, Cloudflare, etc.) - REST API
// 2. Standard Redis (ioredis) - TCP connection
// 3. In-memory fallback for development

type KVStore = {
  get: (key: string) => Promise<number | null>;
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<void>;
};

class InMemoryKV implements KVStore {
  private store = new Map<string, { value: number; expiresAt: number }>();

  async get(key: string): Promise<number | null> {
    const record = this.store.get(key);
    if (!record) return null;
    
    if (Date.now() > record.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return record.value;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = (current || 0) + 1;
    
    // If key doesn't exist, set a default expiration
    if (!this.store.has(key)) {
      this.store.set(key, { value: newValue, expiresAt: Date.now() + 60000 });
    } else {
      const record = this.store.get(key)!;
      record.value = newValue;
    }
    
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<void> {
    const record = this.store.get(key);
    if (record) {
      record.expiresAt = Date.now() + (seconds * 1000);
    }
  }

  // Cleanup expired keys periodically
  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  constructor() {
    // Run cleanup every minute
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 60000);
    }
  }
}

// Upstash Redis (REST API) - Works with Vercel KV, Cloudflare, Railway, etc.
class UpstashKV implements KVStore {
  private kv: any;

  constructor() {
    const hasCredentials = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    
    if (hasCredentials) {
      try {
        const { kv } = require('@vercel/kv');
        this.kv = kv;
      } catch (error) {
        console.warn('Upstash credentials found but @vercel/kv module not available');
        throw error;
      }
    } else {
      throw new Error('Upstash credentials not found');
    }
  }

  async get(key: string): Promise<number | null> {
    return await this.kv.get(key);
  }

  async incr(key: string): Promise<number> {
    return await this.kv.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.kv.expire(key, seconds);
  }
}

// Standard Redis (ioredis) - Works with any Redis instance
class RedisKV implements KVStore {
  private redis: any;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('REDIS_URL not found');
    }

    try {
      const Redis = require('ioredis');
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          if (times > 3) return null;
          return Math.min(times * 100, 3000);
        },
      });

      this.redis.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
      });
    } catch (error) {
      console.warn('REDIS_URL found but ioredis module not available');
      throw error;
    }
  }

  async get(key: string): Promise<number | null> {
    const value = await this.redis.get(key);
    return value ? parseInt(value, 10) : null;
  }

  async incr(key: string): Promise<number> {
    return await this.redis.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

// Create singleton instance
let kvInstance: KVStore | null = null;

function getKVStore(): KVStore {
  if (kvInstance) return kvInstance;

  // Option 1: Upstash (REST API) - Vercel KV, Cloudflare, Railway
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      console.log('Using Upstash Redis (REST) for rate limiting');
      kvInstance = new UpstashKV();
      return kvInstance;
    } catch (error) {
      console.warn('Failed to initialize Upstash, trying other options...');
    }
  }

  // Option 2: Standard Redis (TCP) - Self-hosted, Railway, Render, DigitalOcean, AWS, etc.
  if (process.env.REDIS_URL) {
    try {
      console.log('Using Redis (ioredis) for rate limiting');
      kvInstance = new RedisKV();
      return kvInstance;
    } catch (error) {
      console.warn('Failed to initialize Redis, falling back to in-memory store');
    }
  }

  // Fallback: In-memory store for development
  console.log('Using in-memory store for rate limiting (development only - not production safe)');
  kvInstance = new InMemoryKV();
  return kvInstance;
}

export const kv = getKVStore();
