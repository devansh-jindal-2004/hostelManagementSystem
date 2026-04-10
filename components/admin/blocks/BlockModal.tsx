"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Building2, User, ShieldCheck, DoorOpen, 
  BedDouble, Save, Loader2, Trash2 
} from 'lucide-react';

interface BlockModalProps {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'create';
  blockData: any; 
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

export default function BlockModal({ isOpen, mode, blockData, onClose, onSave, onDelete }: BlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Boys',
    warden: '',
    totalRooms: 0,
    bedsPerRoom: 1
  });

  // Sync state when modal opens or blockData changes
  useEffect(() => {
    if (blockData) {
      setFormData(blockData);
    } else {
      setFormData({ name: '', type: 'Boys', warden: '', totalRooms: 0, bedsPerRoom: 1 });
    }
  }, [blockData, isOpen]);

  if (!isOpen) return null;

  const isView = mode === 'view';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {mode === 'create' ? 'Add New Block' : mode === 'edit' ? 'Edit Block' : 'Block Details'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                {isView ? 'Configuration Overview' : 'Manage Hostel Wing'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Section: Basic Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Wing Identity</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="label-style">Block Name</label>
                {isView ? (
                  <p className="value-style">{formData.name}</p>
                ) : (
                  <input className="input-style" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Block A" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="label-style">Hostel Type</label>
                {isView ? (
                  <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase ${formData.type === 'Boys' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                    {formData.type} Hostel
                  </span>
                ) : (
                  <select className="input-style" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="label-style">Assigned Warden</label>
                {isView ? (
                  <div className="flex items-center gap-2 py-1">
                    <User size={16} className="text-slate-400" />
                    <p className="font-bold text-slate-700">{formData.warden}</p>
                  </div>
                ) : (
                  <select className="input-style" value={formData.warden} onChange={e => setFormData({...formData, warden: e.target.value})}>
                    <option value="">Select a Warden</option>
                    <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
                    <option value="Mrs. Sunita Williams">Mrs. Sunita Williams</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Section: Configuration */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
            <div className="flex items-center gap-2 text-slate-400">
              <DoorOpen size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Room Configuration</span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="label-style">Total Rooms</label>
                {isView ? (
                  <p className="value-style">{formData.totalRooms}</p>
                ) : (
                  <input type="number" className="input-style" value={formData.totalRooms} onChange={e => setFormData({...formData, totalRooms: Number(e.target.value)})} />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="label-style">Beds Per Room</label>
                {isView ? (
                  <p className="value-style">{formData.bedsPerRoom}</p>
                ) : (
                  <input type="number" className="input-style" value={formData.bedsPerRoom} onChange={e => setFormData({...formData, bedsPerRoom: Number(e.target.value)})} />
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-6">
            {mode === 'edit' && onDelete && (
               <button 
                 type="button"
                 className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all"
               >
                 <Trash2 size={20} />
               </button>
            )}
            
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all text-sm"
            >
              {isView ? 'Close Overview' : 'Cancel'}
            </button>
            
            {!isView && (
              <button 
                onClick={() => onSave(formData)}
                disabled={loading}
                className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {mode === 'create' ? 'Create Block' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .label-style {
          @apply text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1;
        }
        .value-style {
          @apply font-bold text-slate-700 px-1 py-1;
        }
        .input-style {
          @apply w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none 
                 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 
                 transition-all text-sm font-bold text-slate-700;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}