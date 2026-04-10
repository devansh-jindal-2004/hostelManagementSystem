import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import Room from "@/model/room.model";
import Block from "@/model/block.model";
import User from "@/model/auth.model";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { createRoomSchema } from "@/lib/validation/room";

export async function PATCH(
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
        const validatedData = createRoomSchema.safeParse(body);

        if (!validatedData.success) {
            const errorMessage = Object.values(validatedData.error.flatten().fieldErrors).flat().join(". ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        }

        const { roomNumber, block, capacity, students } = validatedData.data;

        if (capacity < students.length) {
            return NextResponse.json({ message: "Cannot allot more students than room capacity" }, { status: 400 });
        }

        const oldRoom = await Room.findById(id);
        if (!oldRoom) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }

        if (roomNumber !== oldRoom.roomNumber) {
            const duplicate = await Room.findOne({ roomNumber, block, _id: { $ne: id } });
            if (duplicate) {
                return NextResponse.json({ message: "Room number already exists in this block" }, { status: 400 });
            }
        }

        const capacityDiff = capacity - oldRoom.capacity;
        const occupancyDiff = students.length - oldRoom.students.length;

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { roomNumber, capacity, students },
            { new: true }
        ).populate('students');

        const updatedBlock = await Block.findByIdAndUpdate(
            block,
            {
                $inc: {
                    totalBeds: capacityDiff,
                    occupiedBeds: occupancyDiff
                }
            },
            { new: true }
        ).populate('warden');

        const oldStudentIds = oldRoom.students.map((s: string) => s.toString());
        const removedStudents = oldStudentIds.filter((sId: string) => !students.includes(sId));

        if (removedStudents.length > 0) {
            await User.updateMany(
                { _id: { $in: removedStudents } },
                { $set: { roomNumber: null, hostelBlock: null } }
            );
        }

        if (students.length > 0) {
            await User.updateMany(
                { _id: { $in: students } },
                { $set: { roomNumber: id, hostelBlock: block } }
            );
        }

        const affectedStudentIds = Array.from(new Set([...students, ...removedStudents]));
        const updatedStudents = await User.find({ _id: { $in: affectedStudentIds } }).select("-password");

        return NextResponse.json({
            message: "Room updated successfully",
            room: updatedRoom,
            block: updatedBlock,
            students: updatedStudents
        }, { status: 200 });

    } catch (error) {
        console.error("ROOM_UPDATE_ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        // 1. Authorization
        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const { id } = await ctx.params;

        // 2. Fetch room to get current state before deletion
        const room = await Room.findById(id);
        if (!room) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }

        const studentIds = room.students.map((s: string) => s.toString());
        const blockId = room.block;
        const capacityToRemove = room.capacity;
        const occupancyToRemove = studentIds.length;

        // 3. Update Block: Decrement the beds and occupancy
        const updatedBlock = await Block.findByIdAndUpdate(
            blockId,
            {
                $inc: {
                    totalBeds: -capacityToRemove,
                    occupiedBeds: -occupancyToRemove
                }
            },
            { new: true }
        ).populate('warden');

        // 4. Update Users: Unassign all students who were in this room
        let updatedStudents = [];
        if (studentIds.length > 0) {
            await User.updateMany(
                { _id: { $in: studentIds } },
                { $set: { roomNumber: null, hostelBlock: null } }
            );
            // Fetch updated student profiles to sync frontend context
            updatedStudents = await User.find({ _id: { $in: studentIds } }).select("-password");
        }

        // 5. Delete the Room document
        await Room.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Room deleted and students unassigned",
            block: updatedBlock,
            students: updatedStudents,
        }, { status: 200 });

    } catch (error) {
        console.error("ROOM_DELETE_ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}