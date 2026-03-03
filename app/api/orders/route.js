import { createOrder } from '@/lib/mock-db';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orderData = await req.json();
        const newOrder = await createOrder({
            ...orderData,
            userId: session.user.id || 'unknown',
            userEmail: session.user.email
        });

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
