import { useAuth, User } from "@/context/authContext";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateUserResponse {
    message: string;
    user?: User
}

export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAuth()

    const updateUserFn = async (data: User) => {
        setLoading(true);

        const toastId = toast.loading("Updating Details......");

        try {
            const response = await fetch("/api/auth/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: UpdateUserResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.user) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateUser(result.user)

            toast.success("User Updated Sucessfully", { id: toastId });

            return
        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { updateUserFn, loading };
};