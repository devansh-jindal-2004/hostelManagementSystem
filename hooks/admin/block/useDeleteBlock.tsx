import { Block, useBlocks } from "@/context/blockContext";
import { useState } from "react";
import { toast } from "sonner";
import { BlockFormData } from "./useAddBlock";

interface DeleteBlockResponse {
    message: string;
}

export const useDeleteBlock = () => {
    const [loading, setLoading] = useState(false);
    const {removeBlock} = useBlocks()

    const deleteBlockFn = async (id: string) => {
        setLoading(true);

        const toastId = toast.loading("Deleting Block......");

        try {
            const response = await fetch(`/api/admin/block/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const result: DeleteBlockResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            removeBlock(id)
            
            toast.success("Block Deleted", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { deleteBlockFn, loading };
};