import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { findUserByEmail, updateUserProfile } from "@/lib/mock-db";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await findUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.savedAddresses?.find(a => a.isDefault)?.street || user.savedAddresses?.[0]?.street || '',
            savedAddresses: user.savedAddresses || [],
            image: user.image
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Simplify: Mock update just updates the user object in memory
        const updatedUser = await updateUserProfile(session.user.email, {
            name: data.name,
            phone: data.phone,
            image: data.image
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated (Mock)", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
