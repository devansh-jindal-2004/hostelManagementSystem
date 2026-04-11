"use client";

import React from 'react';
import {
  ShieldAlert, Building2, CreditCard, Users, Megaphone, Activity
} from 'lucide-react';
import { useAlerts } from '@/context/alertContext';
import Link from 'next/link';
import { useComplaints } from '@/context/complaintContext';
import { useBlocks } from '@/context/blockContext';
import { useUsers } from '@/context/UsersContext';

export default function AdminDashboard() {

  const { alerts } = useAlerts()
  const { complaints } = useComplaints()
  const { blocks } = useBlocks()
  const { users } = useUsers()

  const totalBeds = blocks.reduce((sum, block) => {
    return sum + (block.totalBeds || 0);
  }, 0);

  const totalOccupiedBeds = blocks.reduce((sum, block) => {
    return sum + (block.occupiedBeds || 0);
  }, 0);

  const feeStats = users.reduce((acc, user) => {
    const due = user.amountDue || 0;

    if (due > 0) {
      acc.totalAmountDue += due;
      acc.defaulterCount += 1;
    }

    return acc;
  }, { totalAmountDue: 0, defaulterCount: 0 });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-6 antialiased">
      {/* 2. DENSE STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

        {/* Seats */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Seats</p>
            <h2 className="text-xl font-black text-slate-900 leading-none">{totalBeds - totalOccupiedBeds} <span className="text-[10px] text-slate-300 font-bold">/ {totalBeds}</span></h2>
          </div>
        </div>

        {/* Fee Defaulters */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
            <CreditCard size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fee Defaulters</p>
            <h2 className="text-xl font-black text-rose-600 leading-none">{feeStats.defaulterCount} <span className="text-[10px] text-slate-300 font-bold">( ₹ {feeStats.totalAmountDue})</span></h2>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shrink-0">
            <Users size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Community</p>
            <h2 className="text-xl font-black text-slate-900 leading-none">{users.length} <span className="text-[10px] text-slate-300 font-bold">Residents</span></h2>
          </div>
        </div>

        {/* Active Complaints */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-slate-800 text-white rounded-lg shrink-0">
            <Activity size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Standard Queue</p>
            <h2 className="text-xl font-black text-white leading-none">
              {complaints.filter(c => c.status !== "resolved" && c.status !== "rejected").length}
              <span className="text-[10px] text-slate-500 font-bold ml-1">Active</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: ESCALATIONS & ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ESCALATIONS (8 Columns) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert className="text-rose-600" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Escalation Vault</h3>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid gap-2">
            {complaints.filter(c => c.status === "escalated").map((item) => (
              <Link href={"/admin/complaints"} key={item._id}>
                <div className="bg-white border border-slate-200 rounded-xl flex items-center hover:border-rose-300 transition-all group p-1.5 pr-4">
                  <div className="bg-slate-900 text-white h-10 w-12 rounded-lg flex flex-col items-center justify-center shrink-0 group-hover:bg-rose-600 transition-colors">
                    <span className="text-[7px] font-black opacity-50 leading-none">{item.block.blockName}</span>
                    <span className="text-sm font-black leading-none">{item.room.roomNumber}</span>
                  </div>
                  <div className="flex-1 px-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Escalated</span>
                      <h4 className="text-[13px] font-bold text-slate-800 truncate tracking-tight">{item.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <button className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg hover:bg-rose-600 transition-all">Review</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SIDEBAR (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Megaphone className="text-blue-600" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Broadcasts</h3>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            {alerts.map((news) => (
              <Link href={"/admin/announcements"} key={news._id}>
                <div className="flex justify-between items-start group cursor-pointer border-b border-slate-50 pb-2 last:border-0">
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate">{news.title.toLocaleUpperCase()}</h5>
                    <p className="text-[9px] font-medium text-slate-400 mt-1">{new Date(news.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}