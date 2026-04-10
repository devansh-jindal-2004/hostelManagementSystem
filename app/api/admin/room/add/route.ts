import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import Room from "@/model/room.model";
import Block from "@/model/block.model";
import { verifyToken } from "@/lib/tokens/verifyToken";
import { createRoomSchema } from "@/lib/validation/room";
import User from "@/model/auth.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const auth = await verifyToken();
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const body = await req.json();
        
        const validatedData = createRoomSchema.safeParse(body);
        
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
        
        const { roomNumber, block, capacity, students } = validatedData.data;

        // 1. Logic Guard
        if (capacity < students.length) {
            return NextResponse.json(
                { message: "Cannot allot more students than room capacity" },
                { status: 400 }
            );
        }

        // 2. Duplicate Check
        const existingRoom = await Room.findOne({ roomNumber, block });
        if (existingRoom) {
            return NextResponse.json(
                { message: "Room number already exists in this block" },
                { status: 400 }
            );
        }

        // 3. Create the Room
        const newRoom = await Room.create({
            roomNumber,
            block,
            capacity,
            students,
        });

        const updatedBlock = await Block.findByIdAndUpdate(
            block,
            {
                $inc: {
                    totalBeds: capacity,
                    occupiedBeds: students.length
                }
            },
            { new: true }
        ).populate('warden'); 

        // 5. Update and Fetch updated Students (Returning All Fields except password)
        let updatedStudents = [];
        if (students.length > 0) {
            await User.updateMany(
                { _id: { $in: students } },
                {
                    $set: {
                        roomNumber: newRoom._id,
                        hostelBlock: block
                    }
                }
            );
            // Returning all fields for students
            updatedStudents = await User.find({ _id: { $in: students } }).select("-password");
        }

        // 6. Populate the Room Students (Returning All Fields)
        const populatedRoom = await newRoom;

        return NextResponse.json(
            { 
                message: "Room created successfully", 
                room: populatedRoom, 
                block: updatedBlock,
                students: updatedStudents 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("ROOM_CREATION_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}