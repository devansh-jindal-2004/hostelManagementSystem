import { X, UserPlus } from 'lucide-react';

export const OccupantChip = ({ id, users, onRemove }: any) => {
  const student = users.find((u: any) => u._id === id);
  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 pl-3 pr-1 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm animate-in zoom-in-95">
      <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[8px] uppercase">
        {student?.name?.charAt(0) || '?'}
      </div>
      <span className="truncate max-w-[100px]">{student?.name || 'Unknown'}</span>
      <button onClick={() => onRemove(id)} className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

export const SuggestionItem = ({ student, onAdd }: any) => (
  <button
    type="button"
    onClick={() => onAdd(student._id)}
    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0 group"
  >
    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase group-hover:scale-110 transition-transform">
      {student.name.charAt(0)}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800">{student.name}</p>
      <p className="text-[10px] text-slate-400 font-medium">{student.email}</p>
    </div>
    <UserPlus size={16} className="text-slate-300" />
  </button>
);