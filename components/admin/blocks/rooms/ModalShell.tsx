import { X, DoorOpen, Trash2, Save } from 'lucide-react';

export const ModalHeader = ({ mode, blockId, onClose }: {mode: string, blockId: string, onClose: ()=> void}) => (
  <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
        <DoorOpen size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          {mode === 'create' ? 'Add Room' : 'Edit Room'}
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
          Block ID: {blockId?.slice(-6)}
        </p>
      </div>
    </div>
    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
      <X size={24} />
    </button>
  </div>
);

export const ModalFooter = ({ mode, onSave, onClose, onDelete, disabled }: {mode: string, onSave: ()=> void, onClose: ()=> void, onDelete: ()=> void, disabled: boolean}) => (
  <div className="p-8 border-t border-slate-50 flex items-center gap-4 bg-slate-50/50">
    {mode === 'edit' && onDelete && (
      <button 
        type="button" 
        onClick={() => onDelete()}
        className="p-4 bg-white text-rose-500 border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all shadow-sm group"
      >
        <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
      </button>
    )}
    <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">
      Cancel
    </button>
    <button
      onClick={onSave}
      disabled={disabled}
      className="flex-2 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
    >
      <Save size={18} />
      {mode === 'create' ? 'Confirm Room' : 'Apply Changes'}
    </button>
  </div>
);