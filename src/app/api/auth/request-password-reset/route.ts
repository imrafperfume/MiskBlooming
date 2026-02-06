// app/api/auth/request-password-reset/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { resetRequestSchema } from '@/src/lib/zod';
import { randomToken, sha256, generateResetCode } from '@/src/lib/crypto';
import { sendPasswordResetEmail } from '@/src/lib/email';
import { rateLimit } from '@/src/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'ip';
        if (!(await rateLimit(`reset:${ip}`, 3, "5 m"))) return NextResponse.json({ error: 'rate' }, { status: 429 });

        const { email } = resetRequestSchema.parse(await req.json());
        const user = await prisma.user.findUnique({ where: { email } });

        // Always respond ok to avoid user enumeration
        if (!user) return NextResponse.json({ ok: true });

        // Generate both token (for security) and 6-digit code (for user)
        const raw = randomToken(32);
        const resetCode = generateResetCode();

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash: sha256(raw),
                resetCode: resetCode,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        await sendPasswordResetEmail(user.email, resetCode, user.firstName);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Password reset request error:", error);
        return NextResponse.json({ ok: true }, { status: 500 });
    }
}
