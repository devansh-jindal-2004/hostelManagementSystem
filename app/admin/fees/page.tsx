"use client";

import React, { useState, useMemo } from 'react';
import {
  Users, Search,
  AlertCircle, CheckCircle2,
  PlusCircle,
  UserCheck, UserX, Loader2
} from 'lucide-react';
import { useUsers } from '@/context/UsersContext';
import { useUpdateFees } from '@/hooks/admin/fees/useUpdateFees';

export default function FeesPage() {
  const { users, loading } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const { updateFeesFn, loading: feesLoading } = useUpdateFees();

  const students = useMemo(() => {
    return users.filter(user => user.role === 'student');
  }, [users]);

  const stats = useMemo(() => {
    const paidCount = students.filter(s => (s.amountDue || 0) <= 0).length;
    const pendingCount = students.filter(s => (s.amountDue || 0) > 0).length;
    return { paidCount, pendingCount, total: students.length };
  }, [students]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const isPaid = (s.amountDue || 0) <= 0;
    if (statusFilter === 'paid') return matchesSearch && isPaid;
    if (statusFilter === 'pending') return matchesSearch && !isPaid;
    return matchesSearch;
  });

  const handleBulkAddFees = async () => {
    const amount = prompt("Enter amount to add to all student accounts:");
    if (!amount || isNaN(Number(amount))) return;
    updateFeesFn(amount);
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-10 max-w-full overflow-hidden">

      {/* Header - Stacked on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Fee Status</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {students.length} Total Students
          </p>
        </div>
        <button
          onClick={handleBulkAddFees}
          disabled={feesLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-rose-600 text-white rounded-xl md:rounded-2xl font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all text-xs md:text-sm disabled:opacity-70"
        >
          {feesLoading ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={18} />}
          Add Due Fees
        </button>
      </div>

      {/* Status Overview Cards - Smaller on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <StatusCard 
          active={statusFilter === 'all'} 
          onClick={() => setStatusFilter('all')}
          icon={Users} 
          label="Total" 
          count={stats.total} 
          color="slate" 
        />
        <StatusCard 
          active={statusFilter === 'paid'} 
          onClick={() => setStatusFilter('paid')}
          icon={UserCheck} 
          label="Paid" 
          count={stats.paidCount} 
          color="emerald" 
        />
        <StatusCard 
          active={statusFilter === 'pending'} 
          onClick={() => setStatusFilter('pending')}
          icon={UserX} 
          label="Pending" 
          count={stats.pendingCount} 
          color="rose" 
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search students..."
          className="w-full pl-11 pr-4 py-3 md:py-5 bg-white border border-slate-200 rounded-2xl md:rounded-3xl outline-none focus:ring-4 focus:ring-slate-100 transition-all text-sm font-bold text-slate-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results Table Container with Overflow handling */}
      <div className="bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg No</th>
                <th className="px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-5 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => {
                const hasDues = (student.amountDue || 0) > 0;
                return (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 md:px-8 py-3 md:py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold uppercase text-[10px]">
                          {student.name.charAt(0)}
                        </div>
                        <div className="max-w-[120px] md:max-w-none">
                          <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{student.name}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-medium truncate">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 md:px-8 py-3 md:py-5 text-[10px] md:text-xs font-bold text-slate-500">
                      {student.registrationNumber || "N/A"}
                    </td>
                    <td className="px-5 md:px-8 py-3 md:py-5">
                      <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest w-fit ${
                        hasDues ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {hasDues ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
                        {hasDues ? 'Unpaid' : 'Clear'}
                      </div>
                    </td>
                    <td className="px-5 md:px-8 py-3 md:py-5 text-right">
                      <p className={`text-xs md:text-sm font-black ${hasDues ? 'text-rose-600' : 'text-slate-300'}`}>
                        {hasDues ? `₹${student.amountDue?.toLocaleString()}` : '—'}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Status Cards to keep the main return clean
function StatusCard({ active, onClick, icon: Icon, label, count, color }: any) {
  const themes: any = {
    slate: active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-400',
    emerald: active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-100 text-slate-400',
    rose: active ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-100 text-slate-400',
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 transition-all ${themes[color]}`}
    >
      <Icon size={20} className="mb-2 md:mb-4" />
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{label}</p>
      <h2 className="text-2xl md:text-4xl font-black mt-1 leading-none">{count}</h2>
    </div>
  );
}