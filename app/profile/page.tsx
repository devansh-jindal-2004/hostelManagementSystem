"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, LayoutDashboard, Edit3, X, Save, Loader2 } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalSection from '@/components/profile/PersonalSection';
import AcademicSection from '@/components/profile/AcademicSection';
import EmergencySection from '@/components/profile/EmergencySection';
import HostelSection from '@/components/profile/HostelSection';
import { useAuth, User } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useUpdateUser } from '@/hooks/auth/useUpdateUser';
import { toast } from 'sonner';
import Link from 'next/link';

export default function page() {
    const [isEditing, setIsEditing] = useState(false);
    const { loading, updateUserFn } = useUpdateUser()
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [data, setData] = useState<User>({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "student",
        gender: user?.gender || "male",
        hostelBlock: user?.hostelBlock || "",
        roomNumber: user?.roomNumber || "",
        bedNumber: user?.bedNumber || "",
        phoneNumber: user?.phoneNumber || "",
        emergencyContact: user?.emergencyContact || { name: "", relationship: "", phone: "" },
        registrationNumber: user?.registrationNumber || "",
        department: user?.department || "",
        academicYear: user?.academicYear || "",
        isProfileComplete: true,
        _id: user?._id || "",
    })

    useEffect(() => {

        if (user && !isLoading) {
            setData(user)
        }

        if (!user && !isLoading) {
            return router.push("/")
        }
    }, [user, router, isLoading])

    const handleSubmit = () => {
        const requiredFields: (keyof User)[] = [
            "name",
            "email",
            "phoneNumber",
            "gender",
            "department",
            "registrationNumber",
            "academicYear",
            "hostelBlock",
            "roomNumber",
            "bedNumber"
        ];

        for (const field of requiredFields) {
            if (!data[field] || data[field].toString().trim() === "") {
                return toast.error(`Please provide your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            }
        }

        if (
            !data.emergencyContact?.name?.trim() ||
            !data.emergencyContact?.relationship?.trim() ||
            !data.emergencyContact?.phone?.trim()
        ) {
            return toast.error("Please complete all emergency contact details");
        }

        updateUserFn(data)
        setIsEditing(false)
    }


    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:py-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Navigation & Controls */}
                <div className="flex items-center justify-between px-2">
                    <Link href={`/${user?.role}`} >
                        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                    </Link>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all shadow-sm ${isEditing ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {isEditing ? <><X size={18} /> Cancel</> : <><Edit3 size={18} /> Edit Profile</>}
                        </button>
                        <Link href={`/${user?.role}`}>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold shadow-sm hover:bg-slate-50 transition-all">
                                <LayoutDashboard size={18} className="text-blue-600" />
                                Dashboard
                            </button>
                        </Link>
                    </div>
                </div>

                <ProfileHeader user={{ name: data.name, email: data.email, role: data.role }} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <PersonalSection isEditing={isEditing} data={data} setData={setData} />
                        {user?.role === "student" && (
                            <AcademicSection isEditing={isEditing} data={data} setData={setData} />
                        )}
                        <EmergencySection isEditing={isEditing} data={data} setData={setData} />
                    </div>

                    <div className="space-y-8">
                        {user?.role === "student" && (
                            <HostelSection isEditing={isEditing} data={data} setData={setData} />
                        )}
                        {isEditing && (
                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-4xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] animate-in slide-in-from-top-4" onClick={handleSubmit}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>Save Changes</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}