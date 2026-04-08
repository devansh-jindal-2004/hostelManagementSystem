import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/db";
import User from "@/model/auth.model";
import { z } from "zod";
import { verifyToken } from "@/lib/tokens/verifyToken";

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function PUT(req: Request) {
    try {
        await connectToDatabase();

        const user = await verifyToken();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 4. Validate Request Body
        const body = await req.json();
        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;

            const errorMessage = Object.values(errors)
                .flat()
                .join(". ");

            return NextResponse.json(
                { message: errorMessage },
                { status: 400 }
            );
        }

        const { password } = validation.data;

        // 5. Hash New Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 6. Update User in DB
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
                otp: undefined,
                otpExpiry: undefined
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("RESET_PASSWORD_ERROR:", error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}