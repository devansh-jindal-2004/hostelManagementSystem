import { useAuth, User } from "@/context/authContext";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyOtpResponse {
    message: string;
    user?: User;
}

export const useVerifyOtp = () => {
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAuth()

    const verifyOtpFn = async (data: { email: string; otp: string }) => {
        setLoading(true);

        const toastId = toast.loading("Verifying OTP......");

        try {
            const response = await fetch("/api/auth/verifyOtp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: VerifyOtpResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            if (!result.user) {
                toast.error("Something went wrong contact support", { id: toastId })
                return
            }

            updateUser(result.user)

            toast.success("OTP Verified successfully", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { verifyOtpFn, loading };
};