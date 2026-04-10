import { User } from "@/context/authContext";
import { Block, useBlocks } from "@/context/blockContext";
import { Room, useRooms } from "@/context/roomContext";
import { useUsers } from "@/context/UsersContext";
import { useState } from "react";
import { toast } from "sonner";
import { RoomFormData } from "./useAddRoom";

interface UpdateRoomResponse {
    message: string;
    block?: Block,
    room?: Room,
    students: User[]
}

export const useUpdateRoom = () => {
    const [loading, setLoading] = useState(false);
    const { updateBlock } = useBlocks()
    const { updateRoom } = useRooms()
    const { updateUser } = useUsers()

    const updateRoomFn = async (data: RoomFormData, id: string) => {
        setLoading(true);

        const toastId = toast.loading("Updating Room......");
        try {
            const response = await fetch(`/api/admin/room/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: UpdateRoomResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.block || !result.room || !result.students) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateBlock(result.block)
            updateRoom(result.room)
            result.students.map(s => updateUser(s))

            toast.success("Room Updated", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { updateRoomFn, loading };
};