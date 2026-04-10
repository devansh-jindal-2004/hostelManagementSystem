import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/auth.model";
import { loginSchema } from "@/lib/validation/auth";
import { connectToDatabase } from "@/lib/db/db";
import { generateToken } from "@/lib/tokens/tokens";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // 1. Validate Input
        const validation = loginSchema.safeParse(body);
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
        const { email, password } = validation.data;

        // 2. Find User & Include Password (since model hides it by default)
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 3. Verify Password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        await generateToken(user._id);

        // 5. Create Response
        const userObj = user.toObject();
        const { password: _, otp: __, otpExpiry: ___, ...safeUser } = userObj;

        return NextResponse.json(
            {
                message: "Login successful",
                user: safeUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}