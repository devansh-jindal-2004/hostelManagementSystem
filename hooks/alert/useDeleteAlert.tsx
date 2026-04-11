import { useAlerts } from "@/context/alertContext";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAlertResponse {
    message: string;
}

export const useDeleteAlert = () => {
    const [loading, setLoading] = useState(false);
    const { removeAlert } = useAlerts()

    const deleteAlertFn = async (id: string) => {
        setLoading(true);

        const toastId = toast.loading("Deleting Announcement......");

        try {
            const response = await fetch(`/api/alert/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const result: DeleteAlertResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            removeAlert(id)

            toast.success("Announcement Deleted", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { deleteAlertFn, loading };
};