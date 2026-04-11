"use client";

import React from 'react';
import { Zap, Clock, ShieldAlert, MoreVertical } from 'lucide-react';
import { useComplaints } from '@/context/complaintContext';
import { useUpdateComplaintStatus } from '@/hooks/complaint/useUpdateStatus';

function AdminDashboard() {
  const { complaints } = useComplaints()
  const {updateComplaintStatusFn, loading} = useUpdateComplaintStatus()
  const escalated = complaints.filter(i => i.status === 'escalated');
  const standard = complaints.filter(i => i.status !== 'escalated')
    .sort((a, b) => (a.severity === 'Critical' ? -1 : 1));

  const handleClick = (val: "resolve" | "reject", id: string) => {
    if(val == "resolve") updateComplaintStatusFn(id, "resolved")
    if(val == "reject") updateComplaintStatusFn(id, "rejected")    
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 antialiased">

      {/* 1. Header with System Health */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Command Center</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Hostel Monitoring & Escalation</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-rose-600 px-4 py-2 rounded-2xl text-white shadow-lg shadow-rose-200">
            <p className="text-[9px] font-black uppercase opacity-70">Escalated</p>
            <p className="text-xl text-center font-black">{escalated.length}</p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl text-white">
            <p className="text-[9px] font-black uppercase opacity-70">Active</p>
            <p className="text-xl text-center font-black">{standard.length}</p>
          </div>
        </div>
      </header>

      {/* 2. THE ESCALATED STACK (High Contrast / Dark) */}
      <section className="mb-16 relative">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="text-rose-600" size={18} />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Escalated Lockdown</h2>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>

        <div className="space-y-4">
          {escalated.map((item) => (
            <div key={item._id} className="relative group bg-slate-900 rounded-[2.5rem] p-1 pr-6 flex items-center shadow-2xl shadow-rose-200/50">
              {/* Location Badge */}
              <div className="bg-rose-600 text-white h-16 w-16 md:h-20 md:w-20 rounded-[2.2rem] flex flex-col items-center justify-center shrink-0 shadow-lg">
                <span className="text-[8px] font-black uppercase opacity-60">Block {item.block.blockName}</span>
                <span className="text-lg md:text-xl font-black">{item.room.roomNumber}</span>
              </div>

              <div className="flex-1 px-5 py-2 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-rose-500/20 text-rose-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-rose-500/30">Admin Intervention</span>
                  <span className="text-slate-500 text-[9px] font-bold uppercase tracking-tight">{item.category}</span>
                </div>
                <h4 className="text-white text-base font-bold truncate tracking-tight">{item.title}</h4>
                <p className="text-slate-400 text-xs italic truncate mt-0.5">"{item.description}"</p>
              </div>

              <div className="hidden md:flex gap-1">
                {['resolve', 'reject'].map(action => (
                  <button key={action} className="bg-slate-800 hover:bg-white hover:text-black transition-all px-4 py-2 rounded-xl text-[9px] font-black uppercase text-slate-300 tracking-widest" onClick={()=> handleClick(action as "resolve" | "reject", item._id)} disabled={loading}>
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE OPERATIONS FEED (Light / Clean) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-slate-400" size={18} />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Standard Operations</h2>
          <div className="flex-1 h-[1px] bg-slate-100" />
        </div>

        <div className="space-y-2">
          {standard.map((item) => (
            <div key={item._id} className="group bg-white border border-slate-100 rounded-2xl p-4 flex items-center hover:border-slate-300 transition-all">
              {/* Small indicator bar for severity */}
              <div className={`w-1 h-8 rounded-full mr-4 ${item.severity === 'Critical' ? 'bg-orange-500 animate-pulse' : 'bg-slate-200'}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="text-[10px] font-black text-slate-900 uppercase">Room {item.block.blockName}-{item.room.roomNumber}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${item.severity === 'Critical' ? 'text-orange-600' : 'text-slate-400'}`}>
                    {item.severity}
                  </span>
                  <span className="text-slate-300 text-[9px] font-bold ml-auto flex items-center gap-1">
                    <Clock size={10} /> 10m ago
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-700 truncate">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;