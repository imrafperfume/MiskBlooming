import { prisma } from "@/src/lib/db";
import { getSessionUserId } from "@/src/lib/session";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const userId: string | null = await getSessionUserId();
        console.log('userId', userId)
        if (!userId) return NextResponse.json({ message: "user id invalid" }, { status: 404 })
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,
                emailVerified: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

        return NextResponse.json(user, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error.massage }, { status: 500 })
    }
}