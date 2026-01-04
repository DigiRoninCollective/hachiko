// src/lib/kv-config.ts
import { createClient } from '@vercel/kv';

// Initialize the KV client with environment variables
// In a real application, these would be set in your deployment environment
const kv = createClient({
  url: process.env.KV_URL || 'redis://localhost:6379',
  token: process.env.KV_REST_TOKEN || '',
});

export default kv;