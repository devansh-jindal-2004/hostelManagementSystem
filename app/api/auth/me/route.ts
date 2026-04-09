import { connectToDatabase } from "@/lib/db/db";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDatabase();

        const user = await verifyToken();

        if(!user){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        return NextResponse.json({user: user}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "server error"}, {status: 500})
    }
}