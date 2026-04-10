"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Users } from 'lucide-react';
import { useUsers } from '@/context/UsersContext';
import { FormInput, FormSelect } from './FormFields';
import { OccupantChip, SuggestionItem } from './StudentSelectors';
import { ModalHeader, ModalFooter } from './ModalShell';
import { Room } from '@/context/roomContext';
import { useAddRoom } from '@/hooks/admin/room/useAddRoom';
import { toast } from 'sonner';
import { useUpdateRoom } from '@/hooks/admin/room/useUpdateRoom';
import { useDeleteRoom } from '@/hooks/admin/room/useDeleteRoom';

export default function RoomModal({ isOpen, mode, roomData, blockId, onClose }: { isOpen: boolean, mode: "edit" | "create", roomData: Room, blockId: string, onClose: () => void }) {
    const { users } = useUsers();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({ roomNumber: '', capacity: 2, students: [] as string[], block: blockId });
    const { addRoomFn, loading: addLoading } = useAddRoom()
    const { updateRoomFn, loading: updateLoading } = useUpdateRoom()
    const { deleteRoomFn, loading: deleteLoading } = useDeleteRoom()

    useEffect(() => {
        if (roomData && mode === 'edit') {
            setFormData({
                roomNumber: roomData.roomNumber || '',
                capacity: roomData.capacity || 2,
                students: roomData.students?.map((s: any) => typeof s === 'object' ? s._id : s) || [],
                block: blockId
            });
        } else {
            setFormData({ roomNumber: '', capacity: 2, students: [], block: blockId });
        }
    }, [roomData, isOpen, mode]);

    if (!isOpen) return null;

    const suggestedStudents = users.filter(u =>
        u.role === 'student' && !u.hostelBlock && !formData.students.includes(u._id) &&
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);

    const handleSave = async () => {
        if (mode === "create") {
            const result = await addRoomFn(formData)
            if (result) return onClose()
        } else {
            const result = await updateRoomFn(formData, roomData._id)
            if (result) return onClose()
        }
    }

    const handleDelete = async () => {
        const result = await deleteRoomFn(roomData._id)
        if(result) return onClose()
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">

                <ModalHeader mode={mode} blockId={blockId} onClose={onClose} />

                <div className="p-8 overflow-y-auto space-y-8 scrollbar-none">
                    <div className="flex gap-6">
                        <FormInput label="Room Name" placeholder="Room Number" value={formData.roomNumber} onChange={(val: string) => setFormData({ ...formData, roomNumber: val })} />
                        <FormInput label="Bed Capacity" type="number" value={formData.capacity.toString()} onChange={(val: string) => setFormData({ ...formData, capacity: Number(val) })} />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Occupants ({formData.students.length}/{formData.capacity})</label>
                        <div className="relative" ref={suggestionRef}>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 transition-all text-sm font-bold"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onFocus={() => setShowSuggestions(true)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={formData.students.length >= formData.capacity}
                                />
                            </div>
                            {showSuggestions && searchQuery.length > 0 && (
                                <div className="absolute z-10 w-full mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden">
                                    {suggestedStudents.map(s => (
                                        <SuggestionItem key={s._id} student={s} onAdd={(id: string) => {
                                            setFormData({ ...formData, students: [...formData.students, id] });
                                            setSearchQuery("");
                                            setShowSuggestions(false);
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl min-h-[100px] content-start border border-slate-100 shadow-inner">
                            {formData.students.length ? formData.students.map(id => (
                                <OccupantChip key={id} id={id} users={users} onRemove={(sId: string) => setFormData({ ...formData, students: formData.students.filter(id => id !== sId) })} />
                            )) : (
                                <div className="m-auto text-center opacity-20"><Users size={32} className="mx-auto mb-2" /><p className="text-[8px] font-black uppercase tracking-widest">Room Vacant</p></div>
                            )}
                        </div>
                    </div>
                </div>

                <ModalFooter mode={mode} onSave={handleSave} onClose={onClose} onDelete={handleDelete} disabled={!formData.roomNumber || addLoading || updateLoading || deleteLoading} />
            </div>
        </div>
    );
}