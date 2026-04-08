import { User, useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LoginResponse {
    message: string;
    user?: User;
}

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAuth()
    const router = useRouter()

    const loginFn = async (data: { email: string, password: string }) => {
        setLoading(true);

        const toastId = toast.loading("Checking Credentials......");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: LoginResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.user) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateUser(result.user)

            toast.success("Loged In Sucessfully", { id: toastId });

            router.push(`/${result.user.role}`)

            return 
        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { loginFn, loading };
};