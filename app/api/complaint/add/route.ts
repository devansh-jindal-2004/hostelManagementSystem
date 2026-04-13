import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { complaintSchema } from "@/lib/validation/complaint";
import User from "@/model/auth.model";
import Complaint from "@/model/complain.model";
import { NextResponse } from "next/server";
import roomModel from "@/model/room.model";
import blockModel from "@/model/block.model";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const forceRoom = roomModel.modelName;
        const forceBlock = blockModel.modelName;

        const auth = await verifyToken();
        if (!auth || auth.role !== "student") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const body = await req.json();
        const validatedResult = complaintSchema.safeParse(body);

        if (!validatedResult.success) {
            const errors = validatedResult.error.flatten().fieldErrors;

            const errorMessage = Object.values(errors)
                .flat()
                .join(". ");

            return NextResponse.json(
                { message: errorMessage },
                { status: 400 }
            );
        }

        const studentProfile = await User.findById(auth._id).select("roomNumber hostelBlock");

        if (!studentProfile || !studentProfile.roomNumber || !studentProfile.hostelBlock) {
            return NextResponse.json(
                { message: "Room/Block allotment required to raise complaint" },
                { status: 403 }
            );
        }

        // 1. Create the complaint
        const createdComplaint = await Complaint.create({
            student: auth._id,
            room: studentProfile.roomNumber,
            block: studentProfile.hostelBlock,
            ...validatedResult.data,
            status: "pending"
        });

        const populatedComplaint = await Complaint.findById(createdComplaint._id)
            .select("-student")
            .populate("room", "roomNumber")
            .populate("block", "name")
            .lean();

        return NextResponse.json(
            { message: "Ticket raised successfully", complaint: populatedComplaint },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST_COMPLAINT_ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}