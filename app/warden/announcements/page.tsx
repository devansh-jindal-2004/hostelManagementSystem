"use client";

import {
  Megaphone, Clock,
} from 'lucide-react';
import Left from '@/components/admin/alert/Left';
import AlertCard from '@/components/admin/alert/AlertCard';
import { useAlerts } from '@/context/alertContext';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'alert' | 'success';
  createdAt: string;
  createdBy: { _id: string; name: string; role: string };
  targetAudience: 'all' | 'students' | 'staff';
}

export default function AnnouncementsPage() {

  const { alerts } = useAlerts()

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
          <Megaphone size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Broadcaster</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Send updates to everyone in the hostel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Composer */}
        <Left />

        {/* Right Column: Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Broadcasts</h3>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Clock className="mx-auto text-slate-200 mb-2" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No history found</p>
              </div>
            ) : (
              alerts
                .map((announcement) => (
                  <AlertCard
                    key={announcement._id}
                    announcement={announcement}
                  />
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}