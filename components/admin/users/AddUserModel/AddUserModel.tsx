"use client";

import { useState } from 'react';
import { X, UserPlus, Loader2, Info } from 'lucide-react';
import AcademicSection from './AcademicSection';
import IdentitySection from './IdentitySection';
import { useAddUser } from '@/hooks/admin/users/useAddUser';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    gender: 'male',
    phoneNumber: '',
    registrationNumber: '',
    department: '',
    academicYear: '',
    amountDue: 0
  });
  const { addUserFn, loading } = useAddUser()

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const result = await addUserFn(formData)
    if (result) return onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header Section */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create User</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">Account Provisioning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form className="p-10 overflow-y-auto space-y-10 custom-scrollbar">

          {/* Identity Group */}
          <IdentitySection formData={formData} setFormData={setFormData} />

          {/* Academic & Finance Group */}
          {formData.role == "student" && (
            <AcademicSection formData={formData} setFormData={setFormData} />
          )}

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Info size={18} className="text-slate-400 mt-0.5" />
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              A default password <span className="text-slate-900 font-bold">&quot;Welcome1&quot;</span> will be assigned. Users will be able to change it upon after first login.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4.5 text-slate-500 font-bold hover:text-slate-800 transition-all text-sm px-6"
            >
              Cancel Request
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="flex-2 py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-xs md:text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
              {loading ? "Processing..." : "Confirm & Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}