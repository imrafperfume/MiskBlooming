import { cookies } from 'next/headers';

export const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || '__host.sid';
const cookieBase = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/',
};

export async function setCookie(name: string, value: string, maxAgeSeconds: number) {
    const c = await cookies();
    c.set(name, value, { ...cookieBase, maxAge: maxAgeSeconds });
}
export async function clearCookie(name: string) {
    const c = await cookies();
    c.set(name, '', { ...cookieBase, maxAge: 0 });
}
export async function getCookie(name: string) {
    const c = await cookies();
    return c.get(name)?.value || null;
}
