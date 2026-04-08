import { useState } from "react";
import { toast } from "sonner";

interface RequestOtpResponse {
    message: string;
}

export const useRequestOtp = () => {
    const [loading, setLoading] = useState(false);

    const requestOtpFn = async (data: { email: string }) => {
        setLoading(true);

        const toastId = toast.loading("Requesting OTP......");

        try {
            const response = await fetch("/api/auth/sendOtp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: RequestOtpResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            toast.success("OTP sent successfully", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        } finally {
            setLoading(false);
        }
    };

    return { requestOtpFn, loading };
};