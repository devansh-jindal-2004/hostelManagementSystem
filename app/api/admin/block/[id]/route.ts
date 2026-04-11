import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import Block from "@/model/block.model";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { createBlockSchema } from "@/lib/validation/block";
import blockModel from "@/model/block.model";
import User from "@/model/auth.model";
import Room from "@/model/room.model";

export async function PUT(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const { id } = await ctx.params;

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

        const currentBlock = await Block.findById(id);
        if (!currentBlock) {
            return NextResponse.json({ message: "Block not found" }, { status: 404 });
        }

        const duplicateCheck = await Block.findOne({
            name: { $regex: new RegExp(`^${validatedData.data.name}$`, "i") },
            _id: { $ne: id } // Ensure we aren't flagging the block we are currently editing
        });

        if (duplicateCheck) {
            return NextResponse.json(
                { message: "Another block already has this name" },
                { status: 400 }
            );
        }

        const oldWardenId = currentBlock.warden?.toString();
        const newWardenId = validatedData.data.warden;

        const updatedBlock = await Block.findByIdAndUpdate(
            id,
            {
                name: validatedData.data.name,
                type: validatedData.data.type,
                warden: newWardenId,
            },
            { new: true, runValidators: true }
        ).populate("warden", "name");

        if (!updatedBlock) {
            return NextResponse.json({ message: "Block not found" }, { status: 404 });
        }

        if (oldWardenId !== newWardenId) {
            if (oldWardenId) {
                await User.findByIdAndUpdate(oldWardenId, {
                    $set: { hostelBlock: null }
                });
            }

            if (newWardenId) {
                await User.findByIdAndUpdate(newWardenId, {
                    $set: { hostelBlock: id }
                });
            }
        }

        return NextResponse.json(
            { message: "Block updated successfully", block: updatedBlock },
            { status: 200 }
        );

    } catch (error) {
        console.error("BLOCK_UPDATE_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const { id } = await ctx.params;

        const block = await blockModel.findById(id);

        if (!block) {
            return NextResponse.json({ message: "Block not found" }, { status: 404 });
        }

        if (block.occupiedBeds > 0) {
            return NextResponse.json(
                { message: `Cannot delete ${block.name}. There are still ${block.occupiedBeds} students assigned.` },
                { status: 400 }
            );
        }

        const wardenId = block.warden;

        if (wardenId) {
            await User.findByIdAndUpdate(wardenId, {
                $set: { hostelBlock: null }
            });
        }

        await Room.deleteMany({ block: id });

        await blockModel.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Block deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("BLOCK_DELETE_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}