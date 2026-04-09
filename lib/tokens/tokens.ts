import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { cookies } from "next/headers";

export async function generateToken(userId: string){
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

    return tokenHash;
}