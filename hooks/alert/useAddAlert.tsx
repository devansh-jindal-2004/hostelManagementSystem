import { Announcement } from "@/app/admin/announcements/page";
import { useAlerts } from "@/context/alertContext";
import { Block, useBlocks } from "@/context/blockContext";
import { useState } from "react";
import { toast } from "sonner";

export interface AlertFormData {
    title: string,
    content: string,
    type: 'info' | 'alert' | 'success';
    targetAudience: 'all' | 'students' | 'staff';
}

interface AddAlertResponse {
    message: string;
    alert?: Announcement
}

export const useAddAlert = () => {
    const [loading, setLoading] = useState(false);
    const { addAlert } = useAlerts()

    const addAlertFn = async (data: AlertFormData) => {
        setLoading(true);

        const toastId = toast.loading("Creating Announcement......");

        try {
            const response = await fetch("/api/alert/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: AddAlertResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.alert) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            addAlert(result.alert)

            toast.success("Announcement Created", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { addAlertFn, loading };
};