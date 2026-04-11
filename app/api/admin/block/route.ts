import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import User from "@/model/auth.model";
import blockModel from "@/model/block.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        let query = {};

        if (auth.role !== "admin") {
            const wardenProfile = await User.findById(auth._id).select("hostelBlock");

            if (!wardenProfile || !wardenProfile.hostelBlock) {
                return NextResponse.json({ blocks: [] }, { status: 200 });
            }

            query = { _id: wardenProfile.hostelBlock };
        }

        const blocks = await blockModel
            .find(query)
            .populate("warden", "name email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            { message: "Blocks fetched successfully", blocks },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET_BLOCKS_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}