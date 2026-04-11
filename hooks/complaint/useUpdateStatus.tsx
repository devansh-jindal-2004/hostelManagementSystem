import { useComplaints } from "@/context/complaintContext";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateComplaintResponse {
    message: string;
    status?: string
}

export const useUpdateComplaintStatus = () => {
    const [loading, setLoading] = useState(false);
    const { updateComplaint } = useComplaints()

    const updateComplaintStatusFn = async (id: string, status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated") => {
        setLoading(true);

        const toastId = toast.loading("Updating Complaint......");

        try {
            const response = await fetch(`/api/complaint/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({status}),
            });

            const result: UpdateComplaintResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.status) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateComplaint(id, status)

            toast.success("Complaint Created", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { updateComplaintStatusFn, loading };
};