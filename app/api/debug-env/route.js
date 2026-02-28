import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        vars: {
            has_mongo_uri: !!process.env.MONGO_URI,
            mongo_uri_prefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) + '...' : 'MISSING',
            has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
            has_nextauth_url: !!process.env.NEXTAUTH_URL,
            nextauth_url: process.env.NEXTAUTH_URL || 'MISSING'
        },
        database: {
            status: 'pending',
            error: null
        }
    };

    try {
        const conn = await dbConnect();
        if (conn) {
            diagnostics.database.status = 'CONNECTED';
        } else {
            diagnostics.database.status = 'FAILED (Empty connection)';
        }
    } catch (err) {
        diagnostics.database.status = 'ERROR';
        diagnostics.database.error = err.message;
    }

    return NextResponse.json(diagnostics);
}
