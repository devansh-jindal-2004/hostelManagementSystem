import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import User from "@/model/auth.model";
import { verifyOtpSchema } from "@/lib/validation/auth";
import { generateToken } from "@/lib/tokens/tokens"; // Your token helper

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // 1. Validate Input
        const validation = verifyOtpSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Invalid email or OTP format" },
                { status: 400 }
            );
        }

        const { email, otp } = validation.data;

        // 2. Find User and include hidden OTP fields
        const user = await User.findOne({ email }).select("+otp +otpExpiry");

        if (!user || !user.otp) {
            return NextResponse.json(
                { message: "OTP request not found" },
                { status: 404 }
            );
        }

        // 3. Verify OTP & Expiry
        if (user.otp !== otp) {
            return NextResponse.json(
                { message: "Invalid verification code" },
                { status: 401 }
            );
        }

        if (new Date() > user.otpExpiry!) {
            return NextResponse.json(
                { message: "OTP has expired. Please request a new one." },
                { status: 410 }
            );
        }

        // 4. Success! Clear OTP fields
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // 5. Log the user in (Generate Token/Cookies)
        await generateToken(user._id);

        // 6. Return Safe User Object
        const userObj = user.toObject();
        const { password: _, otp: __, otpExpiry: ___, ...safeUser } = userObj;

        return NextResponse.json(
            {
                message: "Logged in successfully",
                user: safeUser
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("VERIFY_OTP_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}