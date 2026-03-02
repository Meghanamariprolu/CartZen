import { getDashboardStats } from '@/lib/mock-db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await getDashboardStats();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
