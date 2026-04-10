"use client";

import React, { useState } from 'react';
import {
  Building2,
  DoorOpen,
  BedDouble,
  Plus,
  Settings2,
  ArrowRight
} from 'lucide-react';
import BlockModal from '@/components/admin/blocks/BlockModal'; // Ensure path is correct
import { Block, useBlocks } from '@/context/blockContext';
import Link from 'next/link';

export default function BlocksPage() {
  const { blocks } = useBlocks()
  const [modal, setModal] = useState<{
    isOpen: boolean;
    mode: 'edit' | 'create';
    data: any | null;
  }>({
    isOpen: false,
    mode: 'edit',
    data: null,
  });

  const openModal = (mode: 'edit' | 'create', data: any = null) => {
    setModal({ isOpen: true, mode, data });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hostel Blocks</h1>
          <p className="text-slate-500 text-sm font-medium">Monitor occupancy and manage wing wardens.</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all text-sm"
        >
          <Plus size={18} />
          Create New Block
        </button>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block) => (
          <BlockCard
            key={block._id}
            block={block}
            onEdit={() => openModal('edit', block)}
          />
        ))}
      </div>

      {/* Global Block Modal */}
      <BlockModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        blockData={modal.data}
        onClose={closeModal}
      />
    </div>
  );
}

interface BlockCardProps {
  block: Block;
  onEdit: () => void;
}

function BlockCard({ block, onEdit }: BlockCardProps) {
  const occupancyRate = Math.round((block.occupiedBeds / block.totalBeds) * 100) || 0;
  const isFull = occupancyRate >= 90;

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col space-y-6">

      {/* Heading */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{block.name}</h2>
          <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${block.type === 'Boys' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
            }`}>
            {block.type} Hostel
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
          <Building2 size={20} />
        </div>
      </div>

      {/* Body: Occupancy Refill Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupancy Rate</p>
          <p className={`text-sm font-black ${isFull ? 'text-rose-600' : 'text-slate-700'}`}>
            {occupancyRate}%
          </p>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 rounded-full ${isFull ? 'bg-rose-500' : 'bg-slate-900'
              }`}
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl space-y-1 border border-slate-100/50">
          <div className="flex items-center gap-2 text-slate-400">
            <DoorOpen size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rooms</span>
          </div>
          <p className="text-sm font-black text-slate-700">
            {block.occupiedBeds} <span className="text-slate-400 font-medium">/ {block.totalBeds}</span>
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl space-y-1 border border-slate-100/50">
          <div className="flex items-center gap-2 text-slate-400">
            <BedDouble size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
          </div>
          <p className="text-sm font-black text-slate-700">
            {block.totalBeds - block.occupiedBeds} <span className="text-slate-400 font-medium text-[10px]">Vacant</span>
          </p>
        </div>
      </div>

      {/* Warden Info */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-slate-200 uppercase">
          {block.warden.name.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Warden</p>
          <p className="text-sm font-bold text-slate-700">{block.warden.name}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs transition-all border border-slate-100"
        >
          <Settings2 size={14} />
          Edit Block
        </button>
        <Link href={`/admin/blocks/${block._id}`}
          className="px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-xl shadow-slate-200 group flex items-center justify-center"
        >
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}