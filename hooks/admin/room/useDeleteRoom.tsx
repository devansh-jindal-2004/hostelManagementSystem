import { User } from "@/context/authContext";
import { Block, useBlocks } from "@/context/blockContext";
import { useRooms } from "@/context/roomContext";
import { useUsers } from "@/context/UsersContext";
import { useState } from "react";
import { toast } from "sonner";


interface DeleteRoomResponse {
    message: string;
    block?: Block,
    students?: User[]
}

export const useDeleteRoom = () => {
    const [loading, setLoading] = useState(false);
    const { updateBlock } = useBlocks()
    const { deleteRoom } = useRooms()
    const { updateUser } = useUsers()

    const deleteRoomFn = async (id: string) => {
        setLoading(true);

        const toastId = toast.loading("Deleting Room......");
        try {
            const response = await fetch(`/api/admin/room/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const result: DeleteRoomResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.block || !result.students) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateBlock(result.block)
            deleteRoom(id)
            result.students.map(s => updateUser(s))

            toast.success("Room Deleted", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { deleteRoomFn, loading };
};