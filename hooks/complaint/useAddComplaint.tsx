import { Complaint, useComplaints } from "@/context/complaintContext";
import { useState } from "react";
import { toast } from "sonner";

export interface ComplaintFormData {
    title: string,
    description: string,
    category: "Electrical" | "Plumbing" | "Internet" | "Furniture" | "Cleaning" | "Other";
    severity: "Low" | "Medium" | "High" | "Critical";
}

interface AddComplaintResponse {
    message: string;
    complaint?: Complaint
}

export const useAddComplaint = () => {
    const [loading, setLoading] = useState(false);
    const { createComplaint } = useComplaints()

    const addComplaintFn = async (data: ComplaintFormData) => {
        setLoading(true);

        const toastId = toast.loading("Creating Complaint......");

        try {
            const response = await fetch("/api/complaint/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: AddComplaintResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.complaint) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            createComplaint(result.complaint)

            toast.success("Complaint Created", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { addComplaintFn, loading };
};