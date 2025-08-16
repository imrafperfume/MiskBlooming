import { randomBytes, createHmac } from 'crypto';
import { cookies, headers } from 'next/headers';

const CSRF_COOKIE = '__host.csrf';
const secret = process.env.CSRF_COOKIE_SECRET!;

export async function issueCsrf() {
    try {
        // send to client to echo in header
        const c = await cookies();
        const nonce = randomBytes(16).toString('base64url');
        const sig = createHmac('sha256', secret).update(nonce).digest('base64url');
        const token = `${nonce}.${sig}`;
        c.set(CSRF_COOKIE, token, { httpOnly: false, secure: true, sameSite: 'strict', path: '/' });
        return token;
    } catch (error: any) {
        return error.message
    }
}

export async function verifyCsrf() {
    const c = await cookies();
    const h = await headers()
    const cookie = c.get(CSRF_COOKIE)?.value;
    const header = h.get('x-csrf-token');
    if (!cookie || !header) return false;
    return cookie === header;
}
