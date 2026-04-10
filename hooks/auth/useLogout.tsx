import { toast } from "sonner";

interface LogoutResponse {
    message: string;
}

export const useLogout = () => {
    const logoutFn = async () => {
        const toastId = toast.loading("Requesting OTP......");

        try {
            const response = await fetch("/api/auth/logout", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const result: LogoutResponse = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Something went wrong", { id: toastId });
                return
            }

            toast.success("Logout successfully", { id: toastId });

            return true

        } catch {
            toast.error("Network error. Please try again.", { id: toastId });
            return
        }
    };

    return { logoutFn };
};