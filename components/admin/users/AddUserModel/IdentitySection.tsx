import React, { Dispatch, SetStateAction } from 'react'
import Input from './Input'
import { ShieldCheck } from 'lucide-react'
import { UserFormData } from './AcademicSection'

function IdentitySection({ formData, setFormData }: { formData: UserFormData, setFormData: Dispatch<SetStateAction<UserFormData>> }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <ShieldCheck size={16} className="text-blue-600" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identity & Access</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label='Full Name' placeHolder='e.g. Devansh Jindal' value={formData.name} change={(val: string) => setFormData({ ...formData, name: val })} />
                <Input label='Email Address' placeHolder='e.g. j.doe@university.edu' value={formData.email} change={(val: string) => setFormData({ ...formData, email: val })} type='email' />

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.15em] ml-1">User Role</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="student">Student Resident</option>
                        <option value="warden">Hostel Warden</option>
                        <option value="admin">System Admin</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.15em] ml-1">Gender</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {formData.role !== "student" && <Input label='Phone Number' placeHolder='e.g. 8847304008' value={formData.phoneNumber} change={(val: string) => setFormData({ ...formData, phoneNumber: val })} />}

            </div>
        </div>
    )
}

export default IdentitySection