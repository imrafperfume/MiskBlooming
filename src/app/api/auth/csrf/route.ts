import { NextResponse } from 'next/server';
import { issueCsrf } from '@/src/lib/csrf';
export async function GET() { return NextResponse.json({ token: issueCsrf() }); }
