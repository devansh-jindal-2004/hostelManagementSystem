import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ResetPassResponse {
    message: string;
}

export const useReset = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()
    const router = useRouter()

    const resetFn = async (data: { password: string }) => {
        setLoading(true);

        const toastId = toast.loading("Reseting Credentials......");

        try {
            const response = await fetch("/api/auth/reset", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: ResetPassResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            toast.success("Loged In Sucessfully", { id: toastId });

            router.push(`/${user?.role}`)

            return 
        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { resetFn, loading };
};