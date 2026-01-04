// KV store wrapper for rate limiting
// In production, this will use Vercel KV (Redis)
// In development, falls back to in-memory store

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

class VercelKV implements KVStore {
  private kv: any;

  constructor() {
    // Dynamically import @vercel/kv only if credentials are available
    const hasCredentials = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    
    if (hasCredentials) {
      try {
        const { kv } = require('@vercel/kv');
        this.kv = kv;
      } catch (error) {
        console.warn('Vercel KV credentials found but module not available, falling back to in-memory');
        throw error;
      }
    } else {
      throw new Error('Vercel KV credentials not found');
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

// Create singleton instance
let kvInstance: KVStore | null = null;

function getKVStore(): KVStore {
  if (kvInstance) return kvInstance;

  // Try to use Vercel KV in production
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      console.log('Using Vercel KV for rate limiting');
      kvInstance = new VercelKV();
      return kvInstance;
    } catch (error) {
      console.warn('Failed to initialize Vercel KV, falling back to in-memory store');
    }
  }

  // Fallback to in-memory store
  console.log('Using in-memory store for rate limiting (not recommended for production)');
  kvInstance = new InMemoryKV();
  return kvInstance;
}

export const kv = getKVStore();
