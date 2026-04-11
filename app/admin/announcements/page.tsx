"use client";

import React, { useState } from 'react';
import { 
  Megaphone, Send, Trash2, 
  Calendar, Info, AlertTriangle, 
  CheckCircle2, Clock, Search,
  Filter, MoreVertical, X
} from 'lucide-react';
import { toast } from 'sonner';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'alert' | 'success';
  createdAt: string;
  targetAudience: 'all' | 'students' | 'staff';
}

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock State for Feed
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      _id: '1',
      title: 'Monthly Maintenance Schedule',
      content: 'The water supply will be interrupted on Sunday from 10 AM to 2 PM for tank cleaning.',
      type: 'info',
      createdAt: new Date().toISOString(),
      targetAudience: 'all'
    },
    {
      _id: '2',
      title: 'Hostel Fee Deadline',
      content: 'This is a reminder that the deadline for semester hostel fees is approaching. Please clear dues by Friday.',
      type: 'alert',
      createdAt: new Date().toISOString(),
      targetAudience: 'students'
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as Announcement['type'],
    targetAudience: 'all' as Announcement['targetAudience']
  });

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    setLoading(true);
    const toastId = toast.loading("Broadcasting announcement...");

    try {
      // API call would go here
      const announcement: Announcement = {
        ...newAnnouncement,
        _id: Math.random().toString(),
        createdAt: new Date().toISOString(),
      };
      
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement({ title: '', content: '', type: 'info', targetAudience: 'all' });
      toast.success("Broadcast successful", { id: toastId });
    } catch (error) {
      toast.error("Failed to broadcast", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a._id !== id));
    toast.success("Announcement removed");
  };

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
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleBroadcast} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6 sticky top-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Send size={14} /> New Broadcast
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text"
                  placeholder="Subject of the announcement"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 transition-all text-sm font-bold text-slate-700"
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Describe the update in detail..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 transition-all text-sm font-bold text-slate-700 resize-none"
                  value={newAnnouncement.content}
                  onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold text-slate-700 appearance-none cursor-pointer"
                    value={newAnnouncement.type}
                    onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value as any})}
                  >
                    <option value="info">General Info</option>
                    <option value="alert">Critical Alert</option>
                    <option value="success">Success / Event</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold text-slate-700 appearance-none cursor-pointer"
                    value={newAnnouncement.targetAudience}
                    onChange={e => setNewAnnouncement({...newAnnouncement, targetAudience: e.target.value as any})}
                  >
                    <option value="all">Everyone</option>
                    <option value="students">Students Only</option>
                    <option value="staff">Staff Only</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !newAnnouncement.title}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <Megaphone size={18} /> Broadcast Now
            </button>
          </form>
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Broadcasts</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Clock className="mx-auto text-slate-200 mb-2" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No history found</p>
              </div>
            ) : (
              announcements
                .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((announcement) => (
                  <AnnouncementCard 
                    key={announcement._id} 
                    announcement={announcement} 
                    onDelete={() => deleteAnnouncement(announcement._id)} 
                  />
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component for individual feed items
function AnnouncementCard({ announcement, onDelete }: { announcement: Announcement, onDelete: () => void }) {
  const typeStyles = {
    info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    alert: { icon: AlertTriangle, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    success: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' }
  };

  const style = typeStyles[announcement.type];
  const Icon = style.icon;

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg.replace('bg-', 'bg-')}`} />
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
            <Icon size={16} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 leading-tight">{announcement.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 flex items-center gap-1">
                <Calendar size={10} /> {new Date(announcement.createdAt).toLocaleDateString()}
              </span>
              <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                {announcement.targetAudience}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <p className="text-xs font-medium text-slate-600 leading-relaxed pl-11">
        {announcement.content}
      </p>
    </div>
  );
}