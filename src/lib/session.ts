import { prisma } from './db';
import { randomToken, sha256 } from './crypto';
import { setCookie, clearCookie, SESSION_COOKIE, getCookie } from './cookies';
import { headers } from 'next/headers';

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string) {
    const raw = randomToken(32);
    const tokenHash = sha256(raw);
    const h = await headers();
    const ua = h.get('user-agent') || '';
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';

    await prisma.session.create({
        data: {
            userId,
            tokenHash,
            expiresAt: new Date(Date.now() + SESSION_TTL * 1000),
            userAgent: ua, ip,
        }
    });
    setCookie(SESSION_COOKIE, raw, SESSION_TTL);
}

export async function getSessionUserId() {
    const raw = await getCookie(SESSION_COOKIE);
    if (!raw) return null;
    const tokenHash = sha256(raw);
    const s = await prisma.session.findUnique({ where: { tokenHash } });
    if (!s || s.revoked || s.expiresAt < new Date()) return null;

    // rotate every 24h
    const needRotate = Date.now() - s.lastRotatedAt.getTime() > 24 * 60 * 60 * 1000;
    if (needRotate) {
        const newRaw = randomToken(32);
        await prisma.$transaction([
            prisma.session.update({ where: { tokenHash }, data: { tokenHash: sha256(newRaw), lastRotatedAt: new Date() } })
        ]);
        setCookie(SESSION_COOKIE, newRaw, Math.floor((s.expiresAt.getTime() - Date.now()) / 1000));
    }
    return s.userId;
}

export async function revokeSession() {
    const raw = await getCookie(SESSION_COOKIE);
    if (raw) {
        await prisma.session.update({ where: { tokenHash: sha256(raw) }, data: { revoked: true } }).catch(() => { });
    }
    clearCookie(SESSION_COOKIE);
}
