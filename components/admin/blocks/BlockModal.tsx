"use client";

import React, { useState, useEffect } from 'react';
import {
  X, Building2, ShieldCheck,
  Save, Loader2, Trash2
} from 'lucide-react';
import { useUsers } from '@/context/UsersContext';
import { Block } from '@/context/blockContext';
import { BlockFormData, useAddBlock } from '@/hooks/admin/block/useAddBlock';
import { useUpdateBlock } from '@/hooks/admin/block/useUpdateBlock';
import { useDeleteBlock } from '@/hooks/admin/block/useDeleteBlock';

interface BlockModalProps {
  isOpen: boolean;
  mode: 'edit' | 'create';
  blockData: Block;
  onClose: () => void;
}

export default function BlockModal({ isOpen, mode, blockData, onClose }: BlockModalProps) {
  const { users } = useUsers()

  const [formData, setFormData] = useState<BlockFormData>({
    name: '',
    type: 'Boys',
    warden: '',
    totalBeds: 0,
    occupiedBeds: 0
  });
  const { addBlockFn, loading } = useAddBlock()
  const { updateBlockFn, loading: updateLoading } = useUpdateBlock()
  const { deleteBlockFn, loading: deleteBlockLoading } = useDeleteBlock()

  const wardensList = users.filter(user => user.role === 'warden');

  useEffect(() => {
    if (blockData && mode === 'edit') {
      setFormData({
        ...blockData,
        warden: blockData.warden._id
      });
    } else {
      setFormData({ name: '', type: 'Boys', warden: '', totalBeds: 0, occupiedBeds: 0 });
    }
  }, [blockData, isOpen, mode]);

  if (!isOpen) return null;

  const inputClasses = "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1";

  const handleSubmit = async () => {
    if (mode == "create") {
      const result = await addBlockFn(formData)

      if (result) return onClose()
    } else {
      const result = await updateBlockFn(formData, blockData._id)

      if (result) return onClose()
    }
  }

  const handleDelete = async () => {
    const result = await deleteBlockFn(blockData._id)

    if (result) return onClose()
  }


  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {mode === 'create' ? 'Create Block' : 'Update Block'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                {mode === 'create' ? 'Add new hostel wing' : `Modifying ${formData.name}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form
          className="p-8 overflow-y-auto space-y-10 scrollbar-thin scrollbar-thumb-slate-200"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Wing Identity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Block Name</label>
                <input
                  required
                  className={inputClasses}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Block A"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Hostel Type</label>
                <select
                  className={inputClasses}
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="Boys">Boys Hostel</option>
                  <option value="Girls">Girls Hostel</option>
                </select>
              </div>

              {/* Dynamic Warden Selection */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className={labelClasses}>Assigned Warden</label>
                <select
                  required
                  className={inputClasses}
                  value={formData.warden}
                  onChange={e => setFormData({ ...formData, warden: e.target.value })}
                >
                  <option value="">
                    {wardensList.length > 0 ? "Select an available warden..." : "No wardens found in system"}
                  </option>
                  {wardensList.map((warden) => (
                    <option key={warden._id} value={warden._id}>
                      {warden.name} ({warden.email})
                    </option>
                  ))}
                </select>
                {wardensList.length === 0 && (
                  <p className="text-[10px] text-rose-500 font-bold ml-1 italic">
                    * Please add a warden in User Management first.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-4">
            {mode === 'edit' && (
              <button
                onClick={handleDelete}
                disabled={deleteBlockLoading}
                className="p-4.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all border border-rose-100 group"
                title="Delete Block"
              >
                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all text-sm px-6"
            >
              Cancel
            </button>

            <button
              disabled={loading || wardensList.length === 0 || updateLoading || deleteBlockLoading}
              onClick={handleSubmit}
              className="flex-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70 text-sm px-6"
            >
              {loading || updateLoading || deleteBlockLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {mode === 'create' ? 'Create Block' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}