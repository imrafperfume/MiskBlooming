// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { resetPasswordWithCodeSchema } from '@/src/lib/zod';
import { hashPassword } from '@/src/lib/password';

export async function POST(req: Request) {
    try {
        const { email, code, password } = resetPasswordWithCodeSchema.parse(await req.json());

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
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

        // Update password, mark token as used, and revoke all sessions
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: await hashPassword(password) }
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() }
            }),
            prisma.session.updateMany({
                where: { userId: user.id },
                data: { revoked: true }
            })
        ]);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
