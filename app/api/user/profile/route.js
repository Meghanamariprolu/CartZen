import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "../../../models/User";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

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
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { action, ...data } = await req.json();
        await dbConnect();

        let updateQuery = {};

        if (action === 'addAddress') {
            updateQuery = { $push: { savedAddresses: data.address } };
        } else if (action === 'removeAddress') {
            updateQuery = { $pull: { savedAddresses: { _id: data.addressId } } };
        } else if (action === 'setDefaultAddress') {
            // First set all isDefault to false, then set chosen one to true
            await User.updateOne(
                { email: session.user.email },
                { $set: { "savedAddresses.$[].isDefault": false } }
            );
            updateQuery = { $set: { "savedAddresses.$[elem].isDefault": true } };
            const options = { arrayFilters: [{ "elem._id": data.addressId }], new: true };
            const user = await User.findOneAndUpdate({ email: session.user.email }, updateQuery, options);
            return NextResponse.json({ message: "Default address updated", user });
        } else {
            // Standard profile update
            updateQuery = {
                $set: {
                    name: data.name,
                    phone: data.phone,
                    image: data.image,
                }
            };
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            updateQuery,
            { new: true }
        );

        return NextResponse.json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
