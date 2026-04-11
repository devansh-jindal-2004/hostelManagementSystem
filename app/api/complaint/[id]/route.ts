import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import Complaint from "@/model/complain.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await ctx.params;
        const { status: newStatus } = await req.json();

        const allowedStatuses = ["pending", "in-progress", "resolved", "rejected", "escalated"];
        if (!allowedStatuses.includes(newStatus)) {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
        }

        const currentStatus = complaint.status;

        if (currentStatus === "escalated" && auth.role !== "admin") {
            return NextResponse.json(
                { message: "Only an Admin can modify an escalated complaint" },
                { status: 403 }
            );
        }

        // 3. Student Rule: Can ONLY change status to 'escalated'
        if (auth.role === "student") {
            if (newStatus !== "escalated") {
                return NextResponse.json(
                    { message: "Students can only escalate their complaints" },
                    { status: 403 }
                );
            }
        }

        complaint.status = newStatus;
        await complaint.save();

        return NextResponse.json(
            { 
                message: `Complaint updated to ${newStatus}`, 
                status: complaint.status 
            }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("STATUS_UPDATE_ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}