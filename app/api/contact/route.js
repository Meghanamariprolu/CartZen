import { saveMessage } from '@/lib/mock-db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.json();
        const newMessage = await saveMessage(data);

        return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
