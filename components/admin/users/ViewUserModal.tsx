"use client";

import React from 'react';
import { 
  X, Mail, Phone, Shield, 
  GraduationCap, MapPin, User, 
  LucideProps
} from 'lucide-react';
import { User as UserType } from '@/context/authContext';

// --- 1. Move DetailItem OUTSIDE the main component ---
interface DetailItemProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  value: string | number; // Allow number for amountDue
  className?: string;
}

const DetailItem = ({ icon: Icon, label, value, className = "" }: DetailItemProps) => (
  <div className={`flex items-start gap-3 p-4 bg-slate-50 rounded-2xl ${className}`}>
    <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-700 break-all">
        {value || "Not Provided"}
      </p>
    </div>
  </div>
);

export default function ViewUserModal({ user, isOpen, onClose }: {user: UserType, isOpen: boolean, onClose: ()=> void}) {
  if (!isOpen || !user) return null;

  const isStudent = user.role === 'student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Section: Basic Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={Mail} label="Email Address" value={user.email} />
            <DetailItem icon={Phone} label="Contact Number" value={user.phoneNumber} />
            <DetailItem icon={Shield} label="Gender" value={user.gender} className="capitalize md:col-span-2" />
          </div>

          {/* STUDENT ONLY SECTIONS */}
          {isStudent && (
            <>
              {/* Academic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                <DetailItem icon={GraduationCap} label="Academic Session" value={user.academicYear || ""} />
                <DetailItem icon={GraduationCap} label="Reg Number" value={user.registrationNumber || ""} />
                <DetailItem icon={GraduationCap} label="Department" value={user.department || ""} className="md:col-span-2" />
              </div>

              {/* Allocation Info */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Hostel Allocation</h3>
                <div className="grid grid-cols-3 gap-4">
                  <DetailItem icon={MapPin} label="Block" value={user.hostelBlock || ""} />
                  <DetailItem icon={MapPin} label="Room" value={user.roomNumber || ""} />
                  <DetailItem icon={MapPin} label="Bed" value={user.bedNumber || ""} />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] ml-1">Emergency Contact</h3>
                <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100"><User size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-0.5">Guardian</p>
                      <p className="text-sm font-bold text-slate-700">{user.emergencyContact?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100"><Phone size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-0.5">Emergency Mobile</p>
                      <p className="text-sm font-bold text-slate-700">{user.emergencyContact?.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance Balance */}
              <div className="p-6 bg-slate-900 rounded-4xl flex justify-between items-center text-white shadow-xl shadow-slate-200">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Balance</p>
                  <p className="text-2xl font-black italic">₹{user.amountDue || 0}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                  user.amountDue === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {user.amountDue === 0 ? 'Account Clear' : 'Dues Pending'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}