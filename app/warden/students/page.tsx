"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, User,
    Mail, Phone, MapPin,
    ChevronRight, GraduationCap,
    LayoutGrid, List, Info, Loader2,
    X, Calendar, Hash, ShieldCheck,
    CreditCard, Briefcase,
    ShieldAlert,
    Heart,
    Wallet,
    Building2
} from 'lucide-react';
import { useUsers } from '@/context/UsersContext';
import { useRooms } from '@/context/roomContext';
import { User as UserType } from '@/context/authContext';
import { useBlocks } from '@/context/blockContext';

export default function WardenStudentsPage() {
    const { users, loading: usersLoading } = useUsers();
    const { rooms, loading: roomsLoading, fetchRooms } = useRooms();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // State for the Detail Modal
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const students = useMemo(() => {
        return users.filter(u => u.role === 'student');
    }, [users]);

    const getRoomName = (studentRoomId: any) => {
        if (!studentRoomId || !rooms.length) return null;
        const idToMatch = typeof studentRoomId === 'object' ? studentRoomId._id : studentRoomId;
        const foundRoom = rooms.find(r => r._id.toString() === idToMatch.toString());
        return foundRoom ? foundRoom.roomNumber : null;
    };

    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    if (usersLoading || roomsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-slate-400" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Resident Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">

            {/* Header & Search Sections (Same as before) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Student Directory</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-blue-600">
                        {students.length} Total Residents
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><List size={18} /></button>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search Residents..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 transition-all text-sm font-bold text-slate-700 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Main Grid/List with onClick to set student */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <StudentGridCard
                            key={student._id}
                            student={student}
                            roomName={getRoomName(student.roomNumber)}
                            onViewProfile={() => setSelectedStudent(student)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <tbody className="divide-y divide-slate-50">
                                {filteredStudents.map((student) => (
                                    <StudentRow
                                        key={student._id}
                                        student={student}
                                        roomName={getRoomName(student.roomNumber)}
                                        onViewProfile={() => setSelectedStudent(student)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    roomName={getRoomName(selectedStudent.roomNumber)}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
}

function StudentDetailModal({ student, roomName, onClose }: { student: UserType, roomName: string | null, onClose: () => void }) {

    const {blocks} = useBlocks()

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Banner / Header */}
                <div className="relative h-44 bg-slate-900">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
                    >
                        <X size={20} />
                    </button>
                    
                    {/* Floating Identity Card */}
                    <div className="absolute -bottom-16 left-10 flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] border-[6px] border-white flex items-center justify-center text-white text-4xl font-black shadow-2xl shrink-0">
                            {student.name.charAt(0)}
                        </div>

                        {/* Name Plate - Placed entirely on white or with high contrast */}
                        <div className="mb-4 space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                                {student.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {student.registrationNumber || "Unregistered"}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    student.isProfileComplete ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                }`}>
                                    {student.isProfileComplete ? 'Verified' : 'Incomplete'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Container - Increased Top Padding to account for floating header */}
                <div className="pt-24 px-10 pb-12 space-y-10">

                    {/* Section 1: Room & Occupancy */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 bg-slate-50 rounded-[2.2rem] border border-slate-100 transition-hover hover:border-blue-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Block / Wing</p>
                            <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-blue-500" />
                                <p className="font-bold text-slate-800">{ blocks[0]?.name || "Not Assigned"}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-[2.2rem] border border-slate-100 transition-hover hover:border-blue-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Room Number</p>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-500" />
                                <p className="font-bold text-slate-800">{roomName || "Pending"}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-[2.2rem] border border-slate-100 transition-hover hover:border-blue-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bed Position</p>
                            <div className="flex items-center gap-2">
                                <Hash size={16} className="text-blue-500" />
                                <p className="font-bold text-slate-800">{student.bedNumber || "N/A"}</p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Column Left: Personal & Academic */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                                    <GraduationCap size={16} className="text-blue-600" /> Academic Profile
                                </h3>
                                <div className="space-y-4">
                                    <DetailItem label="Department" value={student.department || "General"} icon={Briefcase} />
                                    <DetailItem label="Academic Year" value={student.academicYear || "First Year"} icon={Calendar} />
                                    <DetailItem label="Gender" value={student.gender} icon={User} className="capitalize" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                                    <Mail size={16} className="text-blue-600" /> Communication
                                </h3>
                                <div className="space-y-4">
                                    <DetailItem label="Email ID" value={student.email} icon={Mail} />
                                    <DetailItem label="Phone Number" value={student.phoneNumber} icon={Phone} />
                                </div>
                            </div>
                        </div>

                        {/* Column Right: Emergency & Finance */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                                    <ShieldAlert size={16} /> Emergency Contact
                                </h3>
                                {student.emergencyContact ? (
                                    <div className="bg-rose-50/30 p-6 rounded-[2.2rem] border border-rose-100/50 space-y-4">
                                        <DetailItem label="Contact Name" value={student.emergencyContact.name} icon={User} />
                                        <DetailItem label="Relationship" value={student.emergencyContact.relationship} icon={Heart} />
                                        <DetailItem label="Emergency Phone" value={student.emergencyContact.phone} icon={Phone} color="text-rose-600" />
                                    </div>
                                ) : (
                                    <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2.2rem] text-center">
                                        <p className="text-xs font-medium text-slate-400 italic">No contact details provided.</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                                    <Wallet size={16} className="text-blue-600" /> Financial Status
                                </h3>
                                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl shadow-slate-200">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dues</p>
                                        <p className="text-3xl font-black tracking-tighter italic">₹{student.amountDue?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                        <CreditCard size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Detail Row Component
function DetailItem({ label, value, icon: Icon, color = "text-slate-700", className = "" }: any) {
    return (
        <div className={`flex items-start gap-4 ${className}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <Icon size={14} />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className={`text-sm font-bold ${color}`}>{value}</p>
            </div>
        </div>
    );
}

// --- Updated Grid Card ---
function StudentGridCard({ student, roomName, onViewProfile }: any) {
    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-slate-200 group-hover:rotate-3 transition-transform">
                    {student.name.charAt(0)}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Status</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${roomName ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {roomName ? 'Assigned' : 'Unassigned'}
                    </span>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">{student.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">{student.registrationNumber || 'No Registration ID'}</p>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <MapPin size={14} className="text-slate-300" />
                    <span className="text-xs font-bold text-slate-700">{roomName ? `Room ${roomName}` : 'Pending Allotment'}</span>
                </div>
            </div>
            <button
                onClick={onViewProfile}
                className="w-full mt-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
            >
                View Profile <ChevronRight size={14} />
            </button>
        </div>
    );
}

function StudentRow({ student, roomName, onViewProfile }: any) {
    return (
        <tr className="group hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 font-bold text-xs uppercase">{student.name.charAt(0)}</div>
                    <div>
                        <p className="text-sm font-black text-slate-800">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{student.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-4"><span className="text-xs font-bold text-slate-500">{student.registrationNumber || '—'}</span></td>
            <td className="px-8 py-4"><span className="text-xs font-bold text-slate-700">{roomName ? `Room ${roomName}` : 'Not Set'}</span></td>
            <td className="px-8 py-4 text-right">
                <button onClick={onViewProfile} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                    <Info size={18} />
                </button>
            </td>
        </tr>
    );
}