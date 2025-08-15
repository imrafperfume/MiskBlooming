// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyPassword } from '@/src/lib/password';
import { loginSchema } from '@/src/lib/zod';
import { createSession } from '@/src/lib/session';
import { rateLimit } from '@/src/lib/ratelimit';
import { verifyCsrf } from '@/src/lib/csrf';

export async function POST(req: Request) {
    try {
        if (!verifyCsrf()) return NextResponse.json({ error: 'CSRF' }, { status: 403 });
        const ip = req.headers.get('x-forwarded-for') || '0.0.0.0';
        console.log("ip: ", ip);
        if (!(await rateLimit(`login:${ip}`))) return NextResponse.json({ error: 'rate limit reached' }, { status: 429 });

        const { email, password } = loginSchema.parse(await req.json());
        console.log(email, password);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: 'invalid user' }, { status: 401 });

        const ok = await verifyPassword(user.passwordHash, password);
        if (!ok) return NextResponse.json({ error: 'invalid password' }, { status: 401 });

        if (!user.emailVerified) return NextResponse.json({ error: 'Email unverified' }, { status: 403 });

        await createSession(user.id);
        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
