import { NextResponse } from 'next/server';
import { issueCsrf } from '@/src/lib/csrf';
export async function GET() {
    try {
        const token = await issueCsrf();
        console.log(token)
        return NextResponse.json(token);
    } catch (error) {
        return NextResponse.json({ message: "Something Wrong" }, { status: 500 })
    }
}
