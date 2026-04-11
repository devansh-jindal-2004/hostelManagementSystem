"use client";

import React from 'react';
import {
  Users,
  MessageSquare,
  BellRing,
  Search,
  Filter,
  ChevronRight,
  Clock,
  ShieldAlert,
  MoreVertical
} from 'lucide-react';
import { useUsers } from '@/context/UsersContext';
import { useComplaints } from '@/context/complaintContext';
import Link from 'next/link';

// Demo Data tailored for a Warden's scope
const WARDEN_DATA = {
  stats: { totalStudents: 156, activeComplaints: 8, criticalAlerts: 2 },
  alerts: [
    { id: 1, type: "Emergency", msg: "Smoke sensor triggered - Block A 2nd Floor", time: "5m ago" },
    { id: 2, type: "System", msg: "Water pump maintenance scheduled for 4 PM", time: "1h ago" }
  ],
  complaints: [
    { id: "101", room: "204", title: "Ceiling fan making loud noise", severity: "Medium", status: "pending" },
    { id: "102", room: "112", title: "Internet port physically damaged", severity: "High", status: "in-progress" },
    { id: "103", room: "301", title: "Tap leaking in washroom", severity: "Low", status: "pending" }
  ]
};

export default function WardenDashboard() {

  const { users } = useUsers()
  const { complaints } = useComplaints()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8 antialiased">

      <header className="border-b border-slate-100 pb-6 mb-8">
  <div className="flex flex-wrap items-center gap-y-6 gap-x-8 md:gap-x-12">

    {/* Residents */}
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Residents</span>
        <span className="text-2xl font-black text-slate-900 leading-none tabular-nums">
          {users.length}
        </span>
      </div>
      <Users size={20} className="text-slate-200" />
    </div>

    {/* Active - Border removed on mobile, added on MD+ */}
    <div className="flex items-center gap-4 md:border-l md:border-slate-100 md:pl-12">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Active</span>
        <span className="text-2xl font-black text-slate-900 leading-none tabular-nums">
          {complaints.filter(c => c.status !== "resolved" && c.status !== "rejected").length}
        </span>
      </div>
      <MessageSquare size={20} className="text-slate-200" />
    </div>

    {/* Alerts - Border removed on mobile, added on MD+ */}
    <div className="flex items-center gap-4 md:border-l md:border-slate-100 md:pl-12">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] leading-none">Alerts</span>
          <span className="w-1 h-1 bg-rose-600 rounded-full animate-pulse" />
        </div>
        <span className="text-2xl font-black text-rose-600 leading-none tabular-nums">
          {complaints.filter(c => c.severity === "Critical" && c.status !== "resolved" && c.status !== "rejected").length}
        </span>
      </div>
      <BellRing size={20} className="text-rose-200" />
    </div>

  </div>
</header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: COMPLAINTS TRIAGE (8 Columns) */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              Complaint Queue
            </h2>
          </div>

          <div className="space-y-3">
            {complaints.filter(c => c.status !== "resolved" && c.status !== "rejected").map((item) => (
              <Link key={item._id} href={"/warden/complaints"}>
                <div className="bg-white border border-slate-200 rounded-2xl p-1.5 pr-5 flex items-center hover:shadow-md transition-all group">
                  {/* Room ID */}
                  <div className="bg-slate-900 text-white h-12 w-14 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[7px] font-black opacity-50 leading-none">RM</span>
                    <span className="text-sm font-black leading-none">{item.room.roomNumber}</span>
                  </div>

                  <div className="flex-1 px-4 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${item.severity === 'High' || item.severity == "Critical" ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-500'
                        }`}>
                        {item.severity}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">ID: #{item._id}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-slate-800 truncate">{item.title}</h4>
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

// Sub-component for the header stats
function StatMini({ label, value, icon, color = "text-slate-800" }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`text-sm font-black leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}