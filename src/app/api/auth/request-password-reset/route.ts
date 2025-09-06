// app/api/auth/request-password-reset/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { resetRequestSchema } from '@/src/lib/zod';
import { randomToken, sha256 } from '@/src/lib/crypto';
import { sendMail } from '@/src/lib/email';
import { rateLimit } from '@/src/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'ip';
        if (!(await rateLimit(`reset:${ip}`, 3, "5 m"))) return NextResponse.json({ error: 'rate' }, { status: 429 });

        const { email } = resetRequestSchema.parse(await req.json());
        const user = await prisma.user.findUnique({ where: { email } });

        // Always respond ok to avoid user enumeration
        if (!user) return NextResponse.json({ ok: true });

        const raw = randomToken(32);
        await prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash: sha256(raw), expiresAt: new Date(Date.now() + 15 * 60 * 1000) }
        });
        const link = `${process.env.APP_URL}/reset?token=${raw}`;
        await sendMail(email, 'Password reset', `<p>Reset link: <a href="${link}">${link}</a></p>`);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: true }, { status: 500 });
    }
}
