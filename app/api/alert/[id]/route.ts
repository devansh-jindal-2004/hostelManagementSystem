import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import Alert from "@/model/alert.model";
import { verifyToken } from "@/lib/tokens/verifyToken";

export async function DELETE(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const { id } = await ctx.params;

        const alert = await Alert.findById(id);
        if (!alert) {
            return NextResponse.json(
                { message: "Announcement not found" }, 
                { status: 404 }
            );
        }

        await Alert.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Announcement removed successfully", deletedId: id }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("ALERT_DELETE_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}