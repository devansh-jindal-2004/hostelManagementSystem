import { Announcement } from '@/app/admin/announcements/page'
import { useAddAlert } from '@/hooks/alert/useAddAlert'
import { Megaphone, Send } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

function Left() {

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as Announcement['type'],
    targetAudience: 'all' as Announcement['targetAudience']
  })
  const { addAlertFn, loading } = useAddAlert()

  const handleSubmit = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return toast.error("Fill all the fields")
    const result = await addAlertFn(newAnnouncement)
    if (result) setNewAnnouncement({
      title: '',
      content: '',
      type: 'info' as Announcement['type'],
      targetAudience: 'all' as Announcement['targetAudience']
    })
  }

  return (
    <div className="lg:col-span-5 space-y-6">
      <form className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6 sticky top-8">
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
              onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
            <textarea
              rows={4}
              placeholder="Describe the update in detail..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 transition-all text-sm font-bold text-slate-700 resize-none"
              value={newAnnouncement.content}
              onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold text-slate-700 appearance-none cursor-pointer"
                value={newAnnouncement.type}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as "info" | "alert" | "success" })}
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
                onChange={e => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as "all" | "students" | "staff" })}
              >
                <option value="all">Everyone</option>
                <option value="students">Students Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </div>
        </div>

        <button
          disabled={!newAnnouncement.title || loading}
          onClick={handleSubmit}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <Megaphone size={18} /> Broadcast Now
        </button>
      </form>
    </div>
  )
}

export default Left