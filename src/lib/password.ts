import { hash, verify } from 'argon2';
export async function hashPassword(pw: string) {
  return hash(pw, { type: 2, memoryCost: 19456, timeCost: 2, parallelism: 1 });
}
export async function verifyPassword(hashStr: string, pw: string) {
  return verify(hashStr, pw);
}
