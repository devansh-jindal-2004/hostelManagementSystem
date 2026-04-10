import { UserFormData } from "@/components/admin/users/AddUserModel/AcademicSection";
import { User } from "@/context/authContext";
import { useUsers } from "@/context/UsersContext";
import { useState } from "react";
import { toast } from "sonner";

interface AddUserResponse {
    message: string;
    user?: User
}

export const useAddUser = () => {
    const [loading, setLoading] = useState(false);
    const { setUsers } = useUsers()

    const addUserFn = async (data: UserFormData) => {
        setLoading(true);

        const toastId = toast.loading("Creating User......");

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: AddUserResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.user) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            if (result.user) {
                const newUser = result.user;
                setUsers((prev) => [...prev, newUser]);
            }
            toast.success("user added", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { addUserFn, loading };
};