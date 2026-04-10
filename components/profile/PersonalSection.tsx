import { User } from '@/context/authContext';
import { User as UserIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export default function PersonalSection({ isEditing, data, setData }: { isEditing: boolean, data: User, setData: Dispatch<SetStateAction<User>> }) {
  return (
    <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><UserIcon size={20} /></div>
        <h2 className="font-bold text-slate-800 text-lg">Personal Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <Field label="Full Name" value={data.name} isEditing={isEditing} change={(val)=> setData(prev => ({...prev, name: val }))} />
        <Field label="Phone Number" value={"+91 "+ data.phoneNumber} isEditing={isEditing} change={(val)=> setData(prev => ({...prev, phoneNumber: val }))} />
        <Field label="Email" value={data.email} isEditing={isEditing} change={(val)=> setData(prev => ({...prev, email: val }))} />
      </div>
    </section>
  );
}

// Reusable Field Helper
function Field({ label, value, isEditing, change}: {label: string, value: string, isEditing: boolean, change: (value: string)=> void}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-0.5">{label}</label>
      {isEditing ? (
        <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold text-slate-800" defaultValue={value} onChange={e=> change(e.target.value)} />
      ) : (
        <p className="text-base font-bold text-slate-700 px-1 py-1">{value}</p>
      )}
    </div>
  );
}