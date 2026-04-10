import { Block, useBlocks } from "@/context/blockContext";
import { useState } from "react";
import { toast } from "sonner";
import { BlockFormData } from "./useAddBlock";

interface UpdateBlockResponse {
    message: string;
    block?: Block
}

export const useUpdateBlock = () => {
    const [loading, setLoading] = useState(false);
    const {updateBlock} = useBlocks()

    const updateBlockFn = async (data: BlockFormData, id: string) => {
        setLoading(true);

        const toastId = toast.loading("Updating Block......");

        try {
            const response = await fetch(`/api/admin/block/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: UpdateBlockResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.block) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateBlock(result.block)
            
            toast.success("Block Updated", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { updateBlockFn, loading };
};