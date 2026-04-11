import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import Alert from "@/model/alert.model";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { createAlertSchema } from "@/lib/validation/alert";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth || auth.role === "student") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createAlertSchema.safeParse(body);

        if (!validatedData.success) {
            const errors = validatedData.error.flatten().fieldErrors;

            const errorMessage = Object.values(errors)
                .flat()
                .join(". ");

            return NextResponse.json(
                { message: errorMessage },
                { status: 400 }
            );
        }

        const { title, content, type, targetAudience } = validatedData.data;

        const newAlert = await Alert.create({
            title,
            content,
            type,
            targetAudience,
            createdBy: auth._id,
        });

        const populatedAlert = await newAlert.populate('createdBy', 'name role');

        return NextResponse.json(
            { message: "Broadcast successful", alert: populatedAlert },
            { status: 201 }
        );

    } catch (error) {
        console.error("ALERT_CREATION_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}