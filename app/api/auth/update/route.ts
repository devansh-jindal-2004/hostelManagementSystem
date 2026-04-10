import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import User from "@/model/auth.model";
import { updateProfileSchema } from "@/lib/validation/auth";
import { verifyToken } from "@/lib/tokens/verifyToken";
import blockModel from "@/model/block.model";

export async function PATCH(req: Request) {
    try {
        await connectToDatabase();

        // 1. Authenticate the User
        const authenticatedUser = await verifyToken();
        if (!authenticatedUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse and Validate Request Body
        const body = await req.json();
        const validation = updateProfileSchema.safeParse(body);

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

        // 3. Update the User
        const updatedUser = await User.findByIdAndUpdate(
            authenticatedUser._id,
            {
                $set: {
                    ...validation.data,
                    isProfileComplete: true
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userObj = updatedUser.toObject();
        const { password: _, otp: __, otpExpiry: ___, ...safeUser } = userObj;

        return NextResponse.json({
            message: "Profile updated successfully",
            user: safeUser
        }, { status: 200 });

    } catch (error: any) {
        console.error("UPDATE_PROFILE_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}