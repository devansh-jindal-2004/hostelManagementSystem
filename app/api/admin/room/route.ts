import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Room from "@/model/room.model";
import User from "@/model/auth.model";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const user = await verifyToken();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        let query = {};

        if (user.role === "student") {
            const room = await Room.findOne({ students: user._id })
                .populate("students", "name email phoneNumber");
            
            return NextResponse.json({ rooms: room ? [room] : [] }, { status: 200 });
        }

        if (user.role === "warden") {
            const wardenProfile = await User.findById(user._id).select("hostelBlock");
            
            if (!wardenProfile || !wardenProfile.hostelBlock) {
                return NextResponse.json({ rooms: [] }, { status: 200 });
            }

            query = { block: wardenProfile.hostelBlock };
        } 
        
        else if (user.role === "admin") {
            const blockId = searchParams.get("blockId");
            if (!blockId) {
                return NextResponse.json(
                    { message: "Block ID is required for admins to fetch rooms" },
                    { status: 400 }
                );
            }
            query = { block: blockId };
        }

        const rooms = await Room.find(query)
            .populate("students", "name email")
            .sort({ roomNumber: 1 });

        return NextResponse.json({ rooms }, { status: 200 });

    } catch (error) {
        console.error("GET_ROOMS_ERROR:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}