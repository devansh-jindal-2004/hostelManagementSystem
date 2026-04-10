import { User } from "@/context/authContext";
import { Block, useBlocks } from "@/context/blockContext";
import { Room, useRooms } from "@/context/roomContext";
import { useUsers } from "@/context/UsersContext";
import { useState } from "react";
import { toast } from "sonner";

export interface RoomFormData {
    roomNumber: string,
    capacity: number,
    students: string[],
    block: string
}

interface AddRoomResponse {
    message: string;
    block?: Block,
    room?: Room,
    students: User[]
}

export const useAddRoom = () => {
    const [loading, setLoading] = useState(false);
    const { updateBlock } = useBlocks()
    const { createRoom } = useRooms()
    const { updateUser } = useUsers()

    const addRoomFn = async (data: RoomFormData) => {
        setLoading(true);

        const toastId = toast.loading("Creating Room......");
        try {
            const response = await fetch("/api/admin/room/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: AddRoomResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.block || !result.room || !result.students) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateBlock(result.block)
            createRoom(result.room)
            result.students.map(s => updateUser(s))

            toast.success("Room added", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { addRoomFn, loading };
};