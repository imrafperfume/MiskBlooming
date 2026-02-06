import { randomBytes, createHash, timingSafeEqual } from 'crypto';

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url'); // send to user (cookie/link)
}
export function sha256(input: string) {
  return createHash('sha256').update(input).digest('base64url'); // store in DB
}
export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// Generate a 6-digit numeric code for password reset
export function generateResetCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}
