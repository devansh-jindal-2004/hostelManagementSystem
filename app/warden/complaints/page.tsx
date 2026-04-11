"use client";

import React from 'react';
import { Zap, ListFilter, Clock, MoreVertical } from 'lucide-react';
import { Complaint, useComplaints } from '@/context/complaintContext';
import { useUpdateComplaintStatus } from '@/hooks/complaint/useUpdateStatus';

function WardenDashboard() {

    const { complaints } = useComplaints()

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 animate-in fade-in duration-500">

            {/* Slimmed Header */}
            <header className="flex items-center justify-between mb-8 border-b-2 border-slate-50 pb-5">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Complaints</h1>
                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-0.5">Live Management Feed</p>
                </div>
                <div className="flex gap-6 md:gap-8">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Urgent</p>
                        <p className="text-xl font-black text-rose-500 leading-none">{complaints.filter(i => (i.severity === 'Critical' || i.severity === 'High') && i.status !== "resolved").length}</p>
                    </div>
                    <div className="text-right border-l-2 border-slate-50 pl-6 md:pl-8">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active</p>
                        <p className="text-xl font-black text-slate-800 leading-none">{complaints.filter(i => i.status !== "resolved").length}</p>
                    </div>
                </div>
            </header>

            <div className="space-y-10">
                {/* Priority Section */}
                <section>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <Zap size={13} className="text-rose-500 fill-rose-500" />
                        <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Priority Queue</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                        {complaints.filter(i => (i.severity === 'Critical' || i.severity === 'High') && i.status !== "resolved").map((item) => (
                            <ComplaintRow key={item._id} item={item} />
                        ))}
                    </div>
                </section>

                {/* General Section */}
                <section>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <ListFilter size={13} className="text-slate-400" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">General Queue</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                        {complaints.filter(i => (i.severity !== 'Critical' && i.severity !== 'High') && i.status !== "resolved").map((item) => (
                            <ComplaintRow key={item._id} item={item} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function ComplaintRow({ item }: { item: Complaint }) {
    const isUrgent = item.severity === 'Critical' || item.severity === 'High';
    const formatDateTime = (dateInput: string | Date) => {
        return new Date(dateInput).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true // Set to false if you prefer 24-hour format
        });
    };
    const { updateComplaintStatusFn, loading } = useUpdateComplaintStatus()

    const handleClick = (val: "pending" | "in-progress" | "resolved" | "rejected" | "escalated") => {
        updateComplaintStatusFn(item._id, val)
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-all flex flex-col sm:flex-row items-stretch">

            {/* Slimmed Room Indicator */}
            <div className={`w-full sm:w-16 shrink-0 flex flex-row sm:flex-col items-center justify-center py-3 sm:py-0 transition-colors ${isUrgent ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
                }`}>
                <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest mr-1.5 sm:mr-0 sm:mb-0.5">RM</span>
                <span className="text-lg sm:text-xl font-black leading-none">{item.room.roomNumber}</span>
            </div>

            {/* Content Area - Optimized Padding */}
            <div className="flex-1 px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">

                <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${item.severity === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                            item.severity === 'High' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-slate-50 border-slate-100 text-slate-500'
                            }`}>
                            {item.severity}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                            <Clock size={11} /> {formatDateTime(item.createdAt)}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h4 className="text-[15px] font-black text-slate-800 tracking-tight leading-tight">
                            {item.title}
                            <span className="hidden xl:inline mx-3 text-slate-200">|</span>
                            <span className="hidden xl:inline text-[13px] text-slate-400 font-medium italic">
                                {item.description}
                            </span>
                        </h4>
                        {/* Mobile/Tablet Description */}
                        <p className="text-[13px] text-slate-400 font-medium truncate italic xl:hidden mt-0.5">
                            "{item.description}"
                        </p>
                    </div>
                </div>

                {/* Status Actions - High-Density Pill */}
                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                        {['pending', 'in-progress', 'resolved', 'rejected'].map((s) => (
                            <button
                                key={s}
                                disabled={loading}
                                onClick={()=> handleClick(s as "pending" | "in-progress" | "resolved" | "rejected" | "escalated")}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${item.status === s
                                    ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                                    : 'text-slate-400 hover:text-slate-600'
                                    } ${item.status == "escalated" && "hidden"}`}
                            >
                                {s.replace('-', ' ')}
                            </button>
                        ))}
                        {item.status === "escalated" && (
                            <div
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-white text-slate-900 shadow-sm border border-slate-100`}
                            >
                                Escalated
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default WardenDashboard;