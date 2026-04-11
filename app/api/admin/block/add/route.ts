import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import Block from "@/model/block.model";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { createBlockSchema } from "@/lib/validation/block";
import User from "@/model/auth.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        // 1. Authorization Check
        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        // 2. Parse and Sanitize Input
        const body = await req.json();
        const validatedData = createBlockSchema.safeParse(body);

        if (!validatedData.success) {
            const errors = validatedData.error.flatten().fieldErrors;

            const errorMessage = Object.values(errors)
                .flat()
                .join(". ");

            return NextResponse.json(
                { message: errorMessage },
                { status: 400 }
            );
        }

        const { warden } = validatedData.data

        // 3. Check for Existing Block Name (Sanitization/Duplicate Check)
        const existingBlock = await Block.findOne({
            name: { $regex: new RegExp(`^${validatedData.data.name}$`, "i") }
        });

        if (existingBlock) {
            return NextResponse.json(
                { message: "A block with this name already exists" },
                { status: 400 }
            );
        }

        const wardenAlreadyAssigned = await Block.findOne({ warden });
        if (wardenAlreadyAssigned) {
            return NextResponse.json({ message: "This warden is already assigned to another block" }, { status: 400 });
        }

        // 4. Create Block with Defaults forced to 0
        const newBlock = await Block.create({
            ...validatedData.data,
            totalBeds: 0,
            occupiedBeds: 0,
        });

        await User.findByIdAndUpdate(warden, {
            $set: { hostelBlock: newBlock._id }
        });

        const populatedBlock = await newBlock.populate("warden", "name");

        return NextResponse.json(
            { message: "Block created successfully", block: populatedBlock },
            { status: 201 }
        );

    } catch (error) {
        console.error("BLOCK_CREATION_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}