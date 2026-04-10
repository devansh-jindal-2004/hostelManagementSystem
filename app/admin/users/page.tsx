"use client";

import { useState } from 'react';
import { Users, ShieldCheck, UserCog, UserPlus, Eye, Loader2 } from 'lucide-react';
import { useUsers } from '@/context/UsersContext';
import AddUserModal from '@/components/admin/users/AddUserModel/AddUserModel';
import ViewUserModal from '@/components/admin/users/ViewUserModal';
import { User, UserRole } from '@/context/authContext';

export default function UsersPage() {
  const { activeTab, setActiveTab, users, loading } = useUsers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User|null>(null);

  const tabs = [
    { id: 'student', label: 'Students', icon: Users, color: 'blue' },
    { id: 'warden', label: 'Wardens', icon: ShieldCheck, color: 'emerald' },
    { id: 'admin', label: 'Admins', icon: UserCog, color: 'purple' },
  ];

  return (
    <div className="max-w-full overflow-hidden space-y-6 md:space-y-8 animate-in fade-in pb-10">
      
      {/* 1. Header: Stacks on mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Users</h1>
          <p className="text-slate-500 text-sm font-medium">Manage residents & staff</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all text-sm w-full sm:w-auto"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* 2. Search & Tabs: Swipable Tabs */}
      <div className="space-y-4">
        {/* Tab Wrapper with Horizontal Scroll */}
        <div className="relative">
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar touch-pan-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as UserRole)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Content: Grid for Mobile, Table for Desktop */}
      <div className="rounded-4xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={40} /></div>
        ) : (
          <>
            {/* MOBILE VIEW (CARDS) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {users.filter(u => u.role === activeTab).map((user) => (
                <div key={user._id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold uppercase">{user.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-black text-slate-800 leading-tight">{user.name}</h3>
                        <p className="text-xs font-medium text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedUser(user)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Eye size={18} /></button>
                      {/* <button 
                        onClick={() => handleDelete(user._id, user.name)} 
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"
                        disabled={deletingId === user._id}
                      >
                        {deletingId === user._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button> */}
                    </div>
                  </div>

                  {/* Status & Extra Info for Mobile */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Role</span>
                      <span className="text-xs font-bold text-slate-600 capitalize">{user.role}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Fee Status</span>
                       <StatusBadge user={user} isStudent={activeTab === 'student'} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW (TABLE) */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fees</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.filter(u => u.role === activeTab).map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold uppercase">{user.name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs font-medium text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500 capitalize">{user.role}</td>
                      <td className="px-8 py-5"><StatusBadge user={user} isStudent={activeTab === 'student'} /></td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => setSelectedUser(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Eye size={18} /></button>
                           {/* <button onClick={() => handleDelete(user._id, user.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><Trash2 size={18} /></button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => {}} />
      {selectedUser && <ViewUserModal user={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}

// Helper Badge Component
function StatusBadge({ user, isStudent }: { user: User; isStudent: boolean }) {
  if (!isStudent) return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Active</span>;

  const isPaid = user.amountDue === 0;
  return (
    <div className="flex flex-col items-end md:items-start">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
        {isPaid ? 'Paid' : 'Due'}
      </span>
      {!isPaid && <span className="text-[10px] font-bold text-slate-400 mt-0.5">₹{user.amountDue}</span>}
    </div>
  );
}