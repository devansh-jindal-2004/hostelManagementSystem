import { useReset } from '@/hooks/auth/useReset'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'

function ResetPassword() {
    
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const {resetFn, loading: isLoading} = useReset()

    const handleSubmit = () => {
        resetFn({password})
    }

    return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-8 md:p-10 pt-4 md:pt-4 space-y-6">
                <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
                        New Password
                    </label>
                <div className="relative group">
                    {/* Left Icon (Lock) */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>

                    {/* Password Input */}
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                        placeholder="Enter new password"
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

                {/* Action Button */}
                <button
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 group shadow-xl shadow-slate-200"
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div>Reset</div>
                    )}
                </button>
            </div>
        </div>
    )
}

export default ResetPassword