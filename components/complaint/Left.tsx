"use client";

import { ComplaintFormData, useAddComplaint } from '@/hooks/complaint/useAddComplaint'
import { Plus, Send } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner';

function Left() {
    const [data, setData] = useState<ComplaintFormData>({
        title: "",
        description: "",
        category: "Electrical",
        severity: "Low",
    })
    const { addComplaintFn, loading } = useAddComplaint()

    const handleSubmit = () => {
        if (!data.title || !data.description) return toast.error("please fill the form correctly")
        addComplaintFn(data)
    }

    return (
        <aside className="w-full xl:w-[380px] shrink-0 xl:sticky xl:top-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <Plus className="text-blue-600" size={20} /> New Ticket
                </h3>

                <form className="space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Title</label>
                        <input
                            type="text"
                            placeholder="Summarize issue"
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                            value={data.title}
                            onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Category */}
                        <div className="space-y-1.5 text-slate-700">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select
                                className="w-full px-3 py-4 bg-slate-50 border-none rounded-xl outline-none text-[11px] font-bold appearance-none cursor-pointer"
                                value={data.category}
                                onChange={e => setData(prev => ({ ...prev, category: e.target.value as any }))}
                            >
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Internet">Internet</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {/* Severity */}
                        <div className="space-y-1.5 text-slate-700">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity</label>
                            <select
                                className="w-full px-3 py-4 bg-slate-50 border-none rounded-xl outline-none text-[11px] font-bold appearance-none cursor-pointer"
                                value={data.severity}
                                onChange={e => setData(prev => ({ ...prev, severity: e.target.value as any }))}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Details..."
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 text-sm font-bold text-slate-700 resize-none placeholder:text-slate-300"
                            value={data.description}
                            onChange={e => setData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-4 ${ loading ? "bg-slate-600" : "bg-slate-900 hover:bg-blue-600"} text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2`}
                    >
                        Submit <Send size={14} />
                    </button>
                </form>
            </div>
        </aside>
    )
}

export default Left