import { Block, useBlocks } from "@/context/blockContext";
import { useState } from "react";
import { toast } from "sonner";

export interface BlockFormData {
    name: string,
    type: 'Boys' | 'Girls',
    warden: string,
    totalBeds?: number,
    occupiedBeds?: number
}

interface AddBlockResponse {
    message: string;
    block?: Block
}

export const useAddBlock = () => {
    const [loading, setLoading] = useState(false);
    const {addBlock} = useBlocks()

    const addBlockFn = async (data: BlockFormData) => {
        setLoading(true);

        const toastId = toast.loading("Creating Block......");

        try {
            const response = await fetch("/api/admin/block/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: AddBlockResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.block) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            addBlock(result.block)
            
            toast.success("Block added", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { addBlockFn, loading };
};