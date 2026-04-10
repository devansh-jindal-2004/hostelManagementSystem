"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, DoorOpen, Users, Bed, Plus, Loader2, ChevronRight, Settings2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBlocks } from '@/context/blockContext';
import RoomModal from '@/components/admin/blocks/rooms/RoomModal';
import { Room, useRooms } from '@/context/roomContext';

export default function BlockDetailPage() {
    const { id } = useParams();
    const { blocks, loading: blocksLoading } = useBlocks();
    const [currentBlock, setCurrentBlock] = useState<any>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const { rooms, fetchRooms } = useRooms()
    useEffect(() => {

        if(id && typeof id == "string")fetchRooms(id)
        
        if (blocks.length > 0 && id) {
            const found = blocks.find((b: any) => b._id === id);
            setCurrentBlock(found);
        }
    }, [blocks, id]);

    if (blocksLoading && !currentBlock) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-slate-300" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching block details...</p>
            </div>
        );
    }

    if (!currentBlock) return <div className="p-20 text-center font-bold">Block not found</div>;

    const handleAddRoom = () => {
        setModalMode('create');
        setSelectedRoom(null);
        setIsModalOpen(true);
    };

    const handleEditRoom = (room: any) => {
        setModalMode('edit');
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 px-1">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/blocks" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors w-fit group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">All Blocks</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-200 border-4 border-white">
                            <DoorOpen size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{currentBlock.name}</h1>
                            <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mt-1">
                                <Users size={14} /> Warden: <span className="text-slate-700">{currentBlock.warden?.name || "Unassigned"}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddRoom}
                        className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all text-sm hover:bg-slate-800"
                    >
                        <Plus size={18} /> Add New Room
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={DoorOpen} label="Rooms" value={rooms.length} color="slate" />
                <StatsCard icon={Bed} label="Total Beds" value={currentBlock.totalBeds} color="blue" />
                <StatsCard icon={Users} label="Residents" value={currentBlock.occupiedBeds} color="emerald" />
                <StatsCard icon={Settings2} label="Utilization" value={`${Math.round((currentBlock.occupiedBeds / currentBlock.totalBeds) * 100) || 0}%`} color="amber" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <DoorOpen size={48} className="mb-4 opacity-20" />
                        <p className="font-bold text-sm uppercase tracking-widest">No rooms added yet</p>
                    </div>
                ) : (
                    rooms
                        .filter(r => r.roomNumber.toLowerCase().includes(""))
                        .map((room) => (
                            <RoomCard key={room._id} room={room} onClick={() => handleEditRoom(room)} />
                        ))
                )}
            </div>

            <RoomModal
                isOpen={isModalOpen}
                mode={modalMode}
                roomData={selectedRoom}
                blockId={currentBlock._id}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

// ... StatsCard and RoomCard sub-components remain the same ...
function StatsCard({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        slate: "text-slate-600 bg-slate-50",
        blue: "text-blue-600 bg-blue-50",
        emerald: "text-emerald-600 bg-emerald-50",
        amber: "text-amber-600 bg-amber-50"
    };

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-4xl shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-xl font-black text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function RoomCard({ room, onClick }: { room: Room, onClick: () => void }) {
    const isFull = room.students.length >= room.capacity;

    return (
        <div
            onClick={onClick}
            className="bg-white border border-slate-100 rounded-4xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group cursor-pointer"
        >
            {/* Top Header Section */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                        Room {room.roomNumber}
                    </h3>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${isFull
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                    {isFull ? 'Full' : 'Available'}
                </div>
            </div>

            {/* Bed Visualization Dots */}
            <div className="flex gap-2 mb-6">
                {Array.from({ length: room.capacity }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-colors duration-300 ${i < room.students.length ? 'bg-slate-900' : 'bg-slate-100'
                            }`}
                    />
                ))}
            </div>

            {/* Bottom Footer Section */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">
                        {room.students.length} / {room.capacity} Beds
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 transition-all">
                    Manage <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
}