import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import Complaint from "@/model/complain.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        const auth = await verifyToken();

        if (!auth) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let query = {};

        if (auth.role === "student") {
            query = { student: auth._id };
        } else if (auth.role === "warden") {
            query = { block: auth.hostelBlock };
        }

        const complaints = await Complaint.find(query)
            .select("-student")
            .populate("room", "roomNumber")
            .populate("block", "name") 
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ complaints }, { status: 200 });

    } catch (error) {
        console.error("GET_COMPLAINTS_ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}