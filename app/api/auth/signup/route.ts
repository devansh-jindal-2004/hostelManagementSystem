import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/auth.model";
import { signupSchema } from "@/lib/validation/auth";
import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const authenticatedUser = await verifyToken();
        if (!authenticatedUser || authenticatedUser.role == "student") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // 1. Validate & Sanitize using Zod
        const validation = signupSchema.safeParse(body);

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

        // 2. Destructure sanitized data as per requirement
        const { email, password, registrationNumber } = validation.data;

        // 3. Check for existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { registrationNumber: registrationNumber || null }]
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email or ID" },
                { status: 409 }
            );
        }

        // 4. Hash and Save
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            ...validation.data,
            password: hashedPassword,
            isProfileComplete: false,
        });

        // Convert to plain object and strip password
        const userObj = newUser.toObject();
        const { password: _, ...userWithoutPassword } = userObj;

        return NextResponse.json(
            { message: "User created successfully", user: userWithoutPassword },
            { status: 201 }
        );

    } catch {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}