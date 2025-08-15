
import { randomToken, sha256 } from "@/src/lib/crypto";
import { verifyCsrf } from "@/src/lib/csrf";
import { prisma } from "@/src/lib/db";
import { sendMail } from "@/src/lib/email";
import { hashPassword } from "@/src/lib/password";
import { rateLimit } from "@/src/lib/ratelimit";
import { registerSchema } from "@/src/lib/zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if (!verifyCsrf()) return NextResponse.json({ error: 'CSRF' }, { status: 403 });
    const ip = req.headers.get('x-forwarded-for') || 'ip';
    console.log(ip)
    if (!(await rateLimit(`reg:${ip}`))) return NextResponse.json({ error: 'rate' }, { status: 429 });

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

    const { email, password, firstName, lastName, phoneNumber } = parsed.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'exists' }, { status: 409 });

    const user = await prisma.user.create({
        data: { email, passwordHash: await hashPassword(password), firstName, lastName, phoneNumber }
    });

    // email verify token (15 min)
    const raw = randomToken(32);
    await prisma.emailVerificationToken.create({
        data: { userId: user.id, tokenHash: sha256(raw), expiresAt: new Date(Date.now() + 15 * 60 * 1000) }
    });
    const link = `${process.env.APP_URL}/(auth)/verify?token=${raw}`;
    await sendMail(email, 'Verify your email', `<p>Click to verify: <a href="${link}">${link}</a></p>`);

    return NextResponse.json({ ok: true });
}
