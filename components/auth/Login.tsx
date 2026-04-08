"use state"
import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, EyeOff, Eye } from "lucide-react";
import { useLogin } from "@/hooks/auth/useLogin";
import { toast } from "sonner";

function Login({forgotPassword}:{forgotPassword: ()=> void}) {

    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const { loginFn, loading: isLoading } = useLogin()

    const handleSubmit = () => {
        if(!data.email || !data.password) return toast.error("Please fill in all fields")
        loginFn(data)
    }

    return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <form className="p-8 md:p-10 space-y-6">

                {/* Email Field */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={e => setData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                            placeholder="name@college.edu"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                            Password
                        </label>
                        <div  onClick={forgotPassword} className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                            Forgot?
                        </div>
                    </div>
                    <div className="relative group">
                        {/* Left Icon (Lock) */}
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>

                        {/* Password Input */}
                        <input
                            id="password"
                            // Toggle type based on state
                            type={showPassword ? "text" : "password"}
                            required
                            value={data.password}
                            onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                            placeholder="••••••••"
                        />

                        {/* Right Icon (Eye Toggle) */}
                        <button
                            type="button" // Important: Prevent form submission
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-xl shadow-slate-200"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default Login