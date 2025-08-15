// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { revokeSession } from '@/src/lib/session';
export async function POST() {
    try {
        await revokeSession();
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: true }, { status: 500 });
    }
}
