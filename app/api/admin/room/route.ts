import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { NextResponse } from "next/server";
import Room from "@/model/room.model";

export async function GET(req: Request) {
    try {
        await connectToDatabase()

        const user = await verifyToken();

        if (!user || user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url);
        const blockId = searchParams.get("blockId");

        if (!blockId) {
            return NextResponse.json(
                { message: "Block ID is required to fetch rooms" },
                { status: 400 }
            );
        }

        const rooms = await Room.find({ block: blockId })
            .sort({ roomNumber: 1 });

        return NextResponse.json({ rooms }, { status: 200 });
    } catch (error) {

    }
}