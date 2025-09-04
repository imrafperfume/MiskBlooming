import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
// import { Redis } from '@upstash/redis';
// const redis = new redis({ url: process.env.UPSTASH_REDIS_REST_URL! });
export function createRateLimiter(
  limit: number,
  duration: `${number} s` | `${number} m` | `${number} h`
) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, duration),
    prefix: "rl:",
  });
}

// Call function dynamically
export async function rateLimit(
  key: string,
  limit: number,
  duration: `${number} m`
) {
  const limiter = createRateLimiter(limit, duration);
  const { success } = await limiter.limit(key);
  return success;
}
