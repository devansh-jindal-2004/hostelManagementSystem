"use client";

import { Building2 } from "lucide-react";
import Login from "@/components/auth/Login";
import { useEffect, useState } from "react";
import OTP from "@/components/auth/OTP";
import ForgotEmail from "@/components/auth/ForgotEmail";
import ResetPassword from "@/components/auth/ResetPassword";

export default function Home() {

  const [mode, setMode] = useState<"login" | "otp" | "reset" | "forgot">("login")
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans text-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px]" />
      </div>

      <main className="relative w-full max-w-110">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Building2 className="text-white w-9 h-9" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-800">
            Hostel<span className="text-blue-600">Gate</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Please sign in to your account</p>
        </div>
        {mode === "login" ? (
          <Login forgotPassword={() => setMode("forgot")} />
        ) : mode === "forgot" ? (
          <ForgotEmail handleBack={() => setMode("login")} next={() => setMode("otp")} email={email} setEmail={setEmail} />
        ) : mode === "otp" ? (
          <OTP back={() => setMode("forgot")} email={email} next={() => setMode("reset")} />
        ) : (
          <ResetPassword />
        )}
      </main>
    </div>
  );
}