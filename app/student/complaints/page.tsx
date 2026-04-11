"use client";

import React, { useState } from 'react';
import { 
  Wrench, Clock, CheckCircle2, 
  ShieldAlert, Plus, Send, ChevronRight
} from 'lucide-react';

const DEMO_COMPLAINTS = [
  { id: "1", title: "Short circuit in Room 202 outlet", category: "Electrical", severity: "Critical", status: "pending", date: "24 Oct", description: "The socket sparked when I plugged in my charger. It smells like burnt plastic." },
  { id: "2", title: "Main washroom tap won't shut off", category: "Plumbing", severity: "High", status: "in-progress", date: "22 Oct", description: "Water is constantly dripping even when the handle is tight." },
  { id: "3", title: "Squeaky cupboard door hinge", category: "Furniture", severity: "Low", status: "resolved", date: "15 Oct", description: "The right door makes a loud noise every time it opens." },
];

export default function StudentComplaintsPage() {
  const getSeverityStyle = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-rose-600 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-blue-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <Wrench className="text-blue-600" size={28} /> Help Desk
        </h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-1">Maintenance & Support</p>
      </header>

      {/* Main Layout: Using xl for the split instead of lg to give laptop screens more room */}
      <div className="flex flex-col xl:flex-row items-start gap-8">
        
        {/* LEFT: New Ticket Form (Fixed Width) */}
        <aside className="w-full xl:w-[380px] shrink-0 xl:sticky xl:top-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} /> New Ticket
            </h3>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Title</label>
                <input type="text" placeholder="Summarize issue" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-slate-700">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select className="w-full px-3 py-4 bg-slate-50 border-none rounded-xl outline-none text-[11px] font-bold appearance-none"><option>Electrical</option><option>Plumbing</option></select>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity</label>
                  <select className="w-full px-3 py-4 bg-slate-50 border-none rounded-xl outline-none text-[11px] font-bold appearance-none"><option>Low</option><option>Medium</option><option>Critical</option></select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea rows={3} placeholder="Details..." className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-700 resize-none placeholder:text-slate-300" />
              </div>

              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                Submit <Send size={14} />
              </button>
            </form>
          </div>
        </aside>

        {/* RIGHT: Complaint List (Fluid Width) */}
        <main className="flex-1 w-full space-y-4">
          <div className="flex items-center gap-2 px-4 mb-4">
            <Clock size={16} className="text-slate-300" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">History</h3>
          </div>

          <div className="space-y-3">
            {DEMO_COMPLAINTS.map((item) => (
              <div key={item.id} className="bg-white border border-slate-50 rounded-[2rem] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <div className="flex items-center gap-4 sm:gap-6">
                  
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.severity === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <ShieldAlert size={20} />
                  </div>

                  {/* Text Content: Flex-1 and min-w-0 prevents text from pushing the card out */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${getSeverityStyle(item.severity)}`}>
                        {item.severity}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.category} • {item.date}</span>
                    </div>
                    
                    <h4 className="text-sm sm:text-base font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate italic">
                      {item.description}
                    </p>
                  </div>

                  {/* Status: Hidden on tiny screens, shown on laptop */}
                  <div className="hidden md:flex flex-col items-end shrink-0 gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {item.status}
                    </span>
                    <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}