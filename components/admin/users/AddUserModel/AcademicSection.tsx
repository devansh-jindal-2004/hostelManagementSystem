import { GraduationCap } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import Input from './Input'

export interface UserFormData{
    name: string;
    email: string;
    role: string;
    gender: string;
    phoneNumber: string;
    registrationNumber: string;
    department: string;
    academicYear: string;
    amountDue: number;
}

function AcademicSection({formData, setFormData}:{formData: UserFormData, setFormData: Dispatch<SetStateAction<UserFormData>>}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <GraduationCap size={16} className="text-purple-600" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Academic & Logistics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <Input label='Phone Number' placeHolder='e.g. 8847304008' value={formData.phoneNumber} change={(val: string) => setFormData({ ...formData, phoneNumber: val })} />

                <Input label='Registeration Number/UID' placeHolder='e.g. 2024-STUD-001' value={formData.registrationNumber} change={(val: string) => setFormData({ ...formData, registrationNumber: val })} />

                <Input label='Depatment' placeHolder='e.g. Computer Science' value={formData.department} change={(val: string) => setFormData({ ...formData, department: val })} />

                <Input label='Opening Balance' placeHolder='0.00' value={formData.amountDue} change={(val: string) => {
                    const amount = parseInt(val)
                    setFormData({ ...formData, amountDue: amount })
                }} />
            </div>
        </div>
    )
}

export default AcademicSection