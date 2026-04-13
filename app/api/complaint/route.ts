import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import Complaint from "@/model/complain.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import roomModel from "@/model/room.model";
import blockModel from "@/model/block.model";

export async function GET() {
    try {
        await connectToDatabase();
        const auth = await verifyToken();
        const forceRoom = roomModel.modelName;
        const forceBlock = blockModel.modelName;


        if (!auth) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let query = {};

        console.log("Registered Models:", mongoose.modelNames());

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