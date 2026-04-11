import { User } from "@/context/authContext";
import { useUsers } from "@/context/UsersContext";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateFeesResponse {
    message: string;
    students: User[]
}

export const useUpdateFees = () => {
    const [loading, setLoading] = useState(false);
    const { updateUser } = useUsers()

    const updateFeesFn = async (amount: string) => {
        setLoading(true);

        const toastId = toast.loading("Adding fees......");
        try {
            const response = await fetch("/api/auth/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({amount}),
            });

            const result: UpdateFeesResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.students) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            result.students.map(s => updateUser(s))

            toast.success("Fees added", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { updateFeesFn, loading };
};