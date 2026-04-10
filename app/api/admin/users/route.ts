import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import User from "@/model/auth.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const auth = await verifyToken();

        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const users = await User.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {
        console.error("GET_USERS_API_ERROR:", error);
        
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}