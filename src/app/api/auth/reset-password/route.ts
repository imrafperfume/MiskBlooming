// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { resetSchema } from '@/src/lib/zod';
import { sha256 } from '@/src/lib/crypto';
import { hashPassword } from '@/src/lib/password';

export async function POST(req: Request) {
    const { token, password } = resetSchema.parse(await req.json());
    const th = sha256(token);
    const row = await prisma.passwordResetToken.findUnique({ where: { tokenHash: th } });
    if (!row || row.usedAt || row.expiresAt < new Date())
        return NextResponse.json({ error: 'bad_token' }, { status: 400 });

    await prisma.$transaction([
        prisma.user.update({ where: { id: row.userId }, data: { passwordHash: await hashPassword(password) } }),
        prisma.passwordResetToken.update({ where: { tokenHash: th }, data: { usedAt: new Date() } }),
        prisma.session.updateMany({ where: { userId: row.userId }, data: { revoked: true } }) // force logout everywhere
    ]);

    return NextResponse.json({ ok: true });
}
