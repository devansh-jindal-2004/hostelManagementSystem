"use client";

import React, { useState, useMemo } from 'react';
import {
    Search,
    Megaphone,
    CalendarDays,
    Loader2,
    Inbox,
    ChevronDown,
    User
} from 'lucide-react';
import { useAlerts } from '@/context/alertContext';

export default function StudentAlertsPage() {
    const { alerts, loading } = useAlerts();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert =>
            alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [alerts, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Notices...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Megaphone className="text-blue-600" size={24} /> Notice Board
                </h1>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-xs font-bold text-slate-600 w-full sm:w-56 shadow-sm"
                    />
                </div>
            </div>

            {/* Accordion Style Feed */}
            <div className="space-y-2">
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`bg-white border transition-all duration-200 overflow-hidden ${expandedId === alert._id ? 'border-blue-200 ring-4 ring-blue-50 rounded-[1.5rem]' : 'border-slate-100 rounded-2xl hover:border-slate-300'
                                }`}
                        >
                            {/* Header (Always Visible) */}
                            <button
                                onClick={() => toggleExpand(alert._id)}
                                className="w-full text-left p-4 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <TypeBadge type={alert.type} />
                                    <h3 className="text-sm font-black text-slate-800 truncate leading-none">
                                        {alert.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight hidden sm:block">
                                        {new Date(alert.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-300 ${expandedId === alert._id ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </button>

                            {/* Collapsible Content */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${expandedId === alert._id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-4 pb-4 pt-0">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                                            {alert.content}
                                        </p>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between mx-10 my-5">
                                <div className="flex items-center gap-2">
                                    <User size={12} className="text-slate-400" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        Posted by {alert.createdBy?.name || 'Admin'} <span className='font-extrabold text-black'>( {alert.createdBy.role} )</span>
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-slate-300 sm:hidden">
                                    {new Date(alert.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                        <Inbox className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No matching notices</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TypeBadge({ type }: { type: string }) {
    const styles: Record<string, string> = {
        alert: "bg-rose-100 text-rose-700",
        info: "bg-amber-100 text-amber-700",
        update: "bg-blue-100 text-blue-700",
    };

    return (
        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${styles[type] || "bg-slate-100 text-slate-600"}`}>
            {type}
        </span>
    );
}