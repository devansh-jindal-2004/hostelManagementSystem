import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import User from "@/model/auth.model";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import crypto from "crypto";
import { sendOTPMail } from "@/lib/email/mail";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // 1. Validate Email with Zod
        const validation = forgotPasswordSchema.safeParse(body);
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

        const { email } = validation.data;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: "No account found with this email" },
                { status: 404 }
            );
        }

        const otp = crypto.randomInt(1000, 9999).toString();

        // 4. Store OTP in Database (Example logic)
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        await sendOTPMail(email, otp);

        // 5. Success Response
        return NextResponse.json(
            {
                message: "Verification code sent to your email",
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("FORGOT_PASSWORD_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}