import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        const newMessage = await Message.create(data);

        return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
