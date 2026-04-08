import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { UserModel } from "@/models/user.model";

export async function verifyToken() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return null
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await UserModel.findOne({ tokenHash });

        if (!user) {
            return null;
        }

        return user;

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}