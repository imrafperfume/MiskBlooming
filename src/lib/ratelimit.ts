import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';
// import { Redis } from '@upstash/redis';
// const redis = new redis({ url: process.env.UPSTASH_REDIS_REST_URL! });
export const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 req / minute per key
    prefix: 'rl:',
});
export async function rateLimit(key: string) {
    const { success } = await limiter.limit(key);
    return success;
}
