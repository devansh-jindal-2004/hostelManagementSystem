"use client";

import React from 'react';
import {
  Plus,
  Clock,
  Megaphone,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/authContext';
import { useAlerts } from '@/context/alertContext';
import Link from 'next/link';
import { useComplaints } from '@/context/complaintContext';

// Demo Data
const STUDENT_DATA = {
  profile: { name: "Aryan Sharma", room: "101-A" },
  fees: { amountDue: 12500, dueDate: "15 Apr 2026" },
  announcements: [
    { id: 1, title: "Mess Timings updated for Exam Week ", date: "Today", category: "Mess" },
    { id: 2, title: "Server Maintenance: No WiFi tonight ", date: "Yesterday", category: "Network" }
  ],
  myComplaints: [
    { id: "1", title: "Water cooler not cooling ", status: "in-progress", date: "10 Apr" },
    { id: "2", title: "Table lamp repair ", status: "resolved", date: "08 Apr" }
  ]
};

export default function StudentDashboard() {
  const { user } = useAuth()
  const { alerts } = useAlerts()
  const { complaints } = useComplaints()
  const formattedFees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(user?.amountDue || 0);


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 antialiased">
      {/* 2. TOP ROW: FEES & STATUS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* FEE CARD */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden group shadow-xl">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-slate-800 rounded-xl">
                <CreditCard size={20} />
              </div>
              <span className="text-[9px] font-black bg-rose-500 px-2.5 py-1 rounded-full uppercase">Pending</span>
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Due</p>
              <h2 className="text-4xl font-black tracking-tighter">{formattedFees}</h2>
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute -right-4 -bottom-4 text-white opacity-5 rotate-12">
            <CreditCard size={140} />
          </div>
        </div>

        {/* ANNOUNCEMENT SNAPSHOT (Next 2 columns on medium screens) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="text-blue-600" size={18} />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Recent Broadcasts</h3>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.slice(0, 2).map((item) => (
              <Link href={"/student/announcements"} key={item._id}>
                <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                  <div className="min-w-0">
                    <span className="text-[8px] font-black text-blue-600 uppercase mb-1 block">{item.type}</span>
                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 shrink-0">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MY COMPLAINTS (Visual Timeline) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <ShieldAlert className="text-slate-400" size={18} />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">My Activity</h2>
          <div className="flex-1 h-[1px] bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((item) => (
            <div key={item._id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-1.5 h-10 rounded-full ${item.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-400'
                  }`} />
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                      {item.status}
                    </span>
                    <span className="text-slate-300 text-[10px]">• {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-all" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}