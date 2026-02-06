// app/api/auth/verify-reset-code/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyResetCodeSchema } from '@/src/lib/zod';
import { rateLimit } from '@/src/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'ip';
        // Rate limit to prevent brute force attacks on codes
        if (!(await rateLimit(`verify-code:${ip}`, 10, "5 m"))) {
            return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
        }

        const { email, code } = verifyResetCodeSchema.parse(await req.json());

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                userId: user.id,
                resetCode: code,
                usedAt: null,
                expiresAt: { gte: new Date() }
            }
        });

        if (!resetToken) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Verify reset code error:", error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
