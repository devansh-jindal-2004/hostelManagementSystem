"use client";

import { Clock, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useComplaints } from '@/context/complaintContext';
import Left from '@/components/complaint/Left';
import { toast } from 'sonner';
import { useUpdateComplaintStatus } from '@/hooks/complaint/useUpdateStatus';

export default function StudentComplaintsPage() {
    const { complaints } = useComplaints();
    const { updateComplaintStatusFn, loading } = useUpdateComplaintStatus()

    const getSeverityStyle = (level: string) => {
        switch (level) {
            case 'Critical': return 'bg-rose-600 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-blue-600 text-white';
            default: return 'bg-slate-500 text-white';
        }
    };

    // Helper to check if 2 days have passed
    const canEscalateByDate = (createdAt: string) => {
        const createdDate = new Date(createdAt).getTime();
        const now = new Date().getTime();
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
        return (now - createdDate) > twoDaysInMs;
    };

    const handleEscalate = async (id: string) => {
        updateComplaintStatusFn(id, "escalated")
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 overflow-x-hidden">
            <div className="flex flex-col xl:flex-row items-start gap-8">
                <Left />

                <main className="flex-1 w-full space-y-4">
                    <div className="flex items-center gap-2 px-4 mb-4">
                        <Clock size={16} className="text-slate-300" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">History</h3>
                    </div>

                    <div className="space-y-3">
                        {complaints.map((item) => {
                            const showEscalate =
                                item.status !== 'escalated' &&
                                (item.status === 'resolved' || canEscalateByDate(item.createdAt));

                            return (
                                <div key={item._id} className="bg-white border border-slate-50 rounded-4xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.severity === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            <ShieldAlert size={20} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${getSeverityStyle(item.severity)}`}>
                                                    {item.severity}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                                    {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h4 className="text-sm sm:text-base font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate italic">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end shrink-0 gap-3">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'resolved' ? 'text-emerald-500' :
                                                    item.status === 'escalated' ? 'text-rose-600' : 'text-amber-500'
                                                }`}>
                                                {item.status}
                                            </span>

                                            {showEscalate && (
                                                <button
                                                    onClick={() => handleEscalate(item._id)}
                                                    disabled={loading}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <AlertTriangle size={12} /> Escalate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}