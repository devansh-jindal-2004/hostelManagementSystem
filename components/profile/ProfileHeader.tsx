import { User } from '@/context/authContext';
import { Mail } from 'lucide-react';

export default function ProfileHeader({ user }: {user: User}) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
      <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-slate-200">
        {user.name.charAt(0)}
      </div>
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
            <Mail size={14} /> {user.email}
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}