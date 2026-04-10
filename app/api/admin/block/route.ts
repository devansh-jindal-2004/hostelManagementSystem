import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import blockModel from "@/model/block.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const blocks = await blockModel
            .find()
            .populate("warden", "name")
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