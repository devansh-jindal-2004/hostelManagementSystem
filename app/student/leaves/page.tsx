"use client";

import React, { useState } from 'react';
import { 
  PlaneTakeoff, Calendar, Clock, CheckCircle2, 
  XCircle, AlertCircle, Plus, Send, ChevronRight
} from 'lucide-react';

const DEMO_LEAVES = [
  { id: "1", type: "Weekend Trip", start: "28 Oct", end: "30 Oct", status: "pending", reason: "Visiting home for festival." },
  { id: "2", type: "Medical Leave", start: "15 Oct", end: "16 Oct", status: "approved", reason: "Doctor's appointment." },
  { id: "3", type: "Emergency", start: "05 Oct", end: "07 Oct", status: "rejected", reason: "Urgent family matter." },
];

export default function StudentLeavePage() {
  const [form, setForm] = useState({ type: 'Home Visit', startDate: '', endDate: '', reason: '' });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10 animate-in fade-in duration-500">
      
      {/* Main Layout Split */}
      <div className="flex flex-col xl:flex-row items-start gap-10">
        
        {/* LEFT: Pinned Form Card - No internal scrollbars */}
        <aside className="w-full xl:w-[380px] shrink-0 xl:sticky lg:top-8">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} /> New Application
            </h3>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-700">Leave Type</label>
                <select 
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                >
                  <option>Home Visit</option>
                  <option>Medical Leave</option>
                  <option>Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-700">From</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-700">To</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-700">Reason</label>
                <textarea 
                  rows={3}
                  placeholder="Where are you going?"
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-700 resize-none"
                  value={form.reason}
                  onChange={(e) => setForm({...form, reason: e.target.value})}
                />
              </div>

              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-2">
                Submit Request <Send size={14} />
              </button>
            </form>
          </div>
        </aside>

        {/* RIGHT: History List */}
        <main className="flex-1 w-full space-y-4">
          <div className="flex items-center gap-2 px-4 mb-2">
            <Clock size={16} className="text-slate-300" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application History</h3>
          </div>

          <div className="space-y-3">
            {DEMO_LEAVES.map((leave) => (
              <div key={leave.id} className="bg-white border border-slate-50 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group flex items-center justify-between gap-6 overflow-hidden">
                
                <div className="flex items-center gap-5 min-w-0 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    leave.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                    leave.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Calendar size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        leave.status === 'approved' ? 'bg-emerald-500 text-white' : 
                        leave.status === 'rejected' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {leave.status}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{leave.type}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                      {leave.start} — {leave.end}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate italic">
                      "{leave.reason}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:block">
                     {leave.status === 'approved' ? <CheckCircle2 size={20} className="text-emerald-500" /> : 
                      leave.status === 'rejected' ? <XCircle size={20} className="text-rose-500" /> : <AlertCircle size={20} className="text-amber-500" />}
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}