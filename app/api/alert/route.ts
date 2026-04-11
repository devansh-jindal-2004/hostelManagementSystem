import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import Alert from "@/model/alert.model";
import { unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const user = await verifyToken();
        if (!user) {
            return NextResponse.json({ message: unauthorized }, { status: 401 })
        }

        const alerts = await Alert.find()
            .populate('createdBy', 'name role')
            .sort({ createdAt: -1 });

        return NextResponse.json({ alerts }, { status: 200 });

    } catch (error) {
        console.error("FETCH_ALERTS_ERROR:", error);
        return NextResponse.json(
            { message: "Failed to fetch alerts" },
            { status: 500 }
        );
    }
}