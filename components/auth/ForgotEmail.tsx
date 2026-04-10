import { useRequestOtp } from '@/hooks/auth/useRequestOtp';
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner';

function ForgotEmail({ handleBack, next, email, setEmail }: { handleBack: () => void, next: () => void, email: string, setEmail: Dispatch<SetStateAction<string>> }) {
    const { requestOtpFn, loading: isLoading } = useRequestOtp()

    const handleSubmit = async () => {
        if (!email) return toast.error("Please enter your email address");
        const result = await requestOtpFn({ email })
        if (result) {
            next()
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Header with Back Arrow */}
            <div className="px-8 pt-8 flex items-center justify-start">
                <button
                    onClick={handleBack}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors group"
                    type="button"
                >
                    <ArrowLeft className="h-5 w-5 group-active:-translate-x-1 transition-transform" />
                </button>
            </div>

            <form className="p-8 md:p-10 pt-4 md:pt-4 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative group">
                        {/* Left Icon */}
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>

                        {/* Input Field */}
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                            placeholder="name@college.edu"
                        />
                    </div>
                    <p className="text-[11px] text-slate-400 ml-1">
                        We&apos;ll send a verification code to this inbox.
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 group shadow-xl shadow-slate-200"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Continue
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default ForgotEmail