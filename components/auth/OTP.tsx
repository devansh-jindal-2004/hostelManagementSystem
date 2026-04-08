import { useRequestOtp } from '@/hooks/auth/useRequestOtp';
import { useVerifyOtp } from '@/hooks/auth/useVerifyOtp';
import { Edit2 } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

function OTP({ back, email, next }: { back: () => void, email: string, next: () => void }) {

    const [otp, setOtp] = useState(["", "", "", ""]);
    const { requestOtpFn, loading: otpLoading } = useRequestOtp()
    const { verifyOtpFn, loading: verifyLoading } = useVerifyOtp()

    const handleVerify = async (otpValue: string) => {
        const result = await verifyOtpFn({ email, otp: otpValue })
        if (result) {
            next();
        }
    }

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const value = element.value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== "" && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }

        if (value !== "" && index === 3) {
        const finalOtp = newOtp.join("");
        if (finalOtp.length === 4) {
            handleVerify(finalOtp); // Call a separate helper or the onSubmit directly
        }
    }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = (e.currentTarget.previousSibling as HTMLInputElement);
            prevInput?.focus();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Email Display & Edit Section */}
            <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                    <span className="text-xs font-medium text-slate-600">{email}</span>
                    <button
                        type="button"
                        onClick={back}
                        className="p-1 hover:bg-slate-200 rounded-full text-blue-600 transition-colors"
                        title="Edit Email"
                    >
                        <Edit2 className="h-3 w-3" />
                    </button>
                </div>

                <div className="text-center">
                    <label className="text-sm font-semibold text-slate-700 block">
                        Verification Code
                    </label>
                    <p className="text-xs text-slate-500 mt-1">
                        Enter the 4-digit code sent to your inbox
                    </p>
                </div>
            </div>

            {/* OTP Input Grid */}
            <div className="flex justify-center gap-3">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={data}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onChange={e => handleOtpChange(e.target, index)}
                        onFocus={e => e.target.select()}
                        className="w-14 h-16 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 shadow-sm"
                    />
                ))}
            </div>

            <div className="text-center">
                <button
                    type="button"
                    disabled={otpLoading}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                    onClick={() => requestOtpFn({ email })}
                >
                    {!otpLoading ? (
                        <>
                            <div className="w-3 h-3 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Resend Code?"
                    )}
                </button>
            </div>
        </div>
    )
}

export default OTP