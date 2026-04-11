import { Announcement } from "@/app/admin/announcements/page";
import { useDeleteAlert } from "@/hooks/alert/useDeleteAlert";
import { AlertTriangle, Calendar, CheckCircle2, Info, Trash2 } from "lucide-react";

export default function AlertCard({ announcement }: { announcement: Announcement }) {
    const typeStyles = {
        info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
        alert: { icon: AlertTriangle, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
        success: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' }
    };
    const {deleteAlertFn, loading} = useDeleteAlert()

    const style = typeStyles[announcement.type];
    const Icon = style.icon;

    return (
        <div className="bg-white border border-slate-100 rounded-4xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
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
                    onClick={()=> deleteAlertFn(announcement._id)}
                    disabled={loading}
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