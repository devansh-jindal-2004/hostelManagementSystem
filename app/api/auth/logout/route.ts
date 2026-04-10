import { cookies } from "next/headers";
import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import User from "@/model/auth.model";

export async function GET() {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Already logged out" });
        }

        cookieStore.set("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        });

        return NextResponse.json({
            message: "Logout successful",
        });

    } catch (error) {
        console.error("Logout Error:", error);

        return NextResponse.json(
            { message: "Logout failed" },
            { status: 500 }
        );
    }
}