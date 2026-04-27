import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Redis client — gracefully handles missing config
export const redis = process.env.UPSTASH_REDIS_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    })
  : null;

// Rate limiter: 100 requests per minute per IP
export const rateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
    })
  : null;
