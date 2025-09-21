import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// export async function publishNotification(notification: any) {
//   console.log("Publishing to Redis:", notification); // ✅ debug
//   await redis.publish("NEW_NOTIFICATION", JSON.stringify(notification));
// }
