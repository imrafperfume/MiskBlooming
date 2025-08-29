// app/api/auth/verify-email/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { sha256 } from '@/src/lib/crypto';
import { verifySchema } from '@/src/lib/zod';

export async function POST(req: Request) {
    try {
        const { token } = verifySchema.parse(await req.json());
        console.log(token)
        const th = sha256(token);
        const row = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: th } });
        if (!row || row.usedAt || row.expiresAt < new Date()) return NextResponse.json({ error: 'bad_token' }, { status: 400 });

        await prisma.$transaction([
            prisma.user.update({ where: { id: row.userId }, data: { emailVerified: true } }),
            prisma.emailVerificationToken.update({ where: { tokenHash: th }, data: { usedAt: new Date() } })
        ]);
        
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
