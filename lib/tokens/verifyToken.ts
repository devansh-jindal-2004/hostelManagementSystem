import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/model/auth.model";
import { connectToDatabase } from "@/lib/db/db";

export async function verifyToken() {
    try {
        await connectToDatabase();
        
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            console.log("No token found in cookies");
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        if (!decoded || !decoded.userId) {
            console.log("Invalid token payload");
            return null;
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return null;
        }

        return user;

    } catch {        
        return null;
    }
}