import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import User from "@/model/auth.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();

        if (!auth || auth.role === "student") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let query = {};

        if (auth.role === "warden") {
            const wardenProfile = await User.findById(auth._id).select("hostelBlock");
            
            if (!wardenProfile || !wardenProfile.hostelBlock) {
                return NextResponse.json({ users: [] }, { status: 200 });
            }

            query = { 
                role: "student", 
                hostelBlock: wardenProfile.hostelBlock 
            };
        } 

        const users = await User.find(query)
            .select("-password")
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