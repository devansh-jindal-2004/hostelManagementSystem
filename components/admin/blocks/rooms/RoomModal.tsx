"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, DoorOpen, Bed, Users, Save, 
  Loader2, Trash2, UserPlus, UserMinus, Search, ChevronDown 
} from 'lucide-react';
import { useUsers } from '@/context/UsersContext';

interface RoomModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  roomData: any;
  blockId: string;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

export default function RoomModal({ isOpen, mode, roomData, blockId, onClose, onSave, onDelete }: RoomModalProps) {
  const { users } = useUsers();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Standard',
    capacity: 2,
    students: [] as any[], 
  });

  // Filter: Students who are not assigned anywhere
  const unassignedStudents = users.filter(user => 
    user.role === 'student' && 
    !user.hostelBlock && 
    !user.roomNumber &&
    !formData.students.find(s => s._id === user._id)
  );

  // Filtered suggestions based on user typing
  const suggestedStudents = unassignedStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit suggestions to 5 for cleanliness

  useEffect(() => {
    if (roomData && mode === 'edit') {
      setFormData({
        roomNumber: roomData.roomNumber || '',
        roomType: roomData.roomType || 'Standard',
        capacity: roomData.capacity || 2,
        students: roomData.students || []
      });
    } else {
      setFormData({ roomNumber: '', roomType: 'Standard', capacity: 2, students: [] });
    }
  }, [roomData, isOpen, mode]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const inputClasses = "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1";

  const addStudent = (student: any) => {
    if (formData.students.length < formData.capacity) {
      setFormData({ ...formData, students: [...formData.students, student] });
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const removeStudent = (studentId: string) => {
    setFormData({ ...formData, students: formData.students.filter(s => s._id !== studentId) });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white">
              <DoorOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {mode === 'create' ? 'Add Room' : 'Edit Room'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Block Assignment: {blockId.slice(-6)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto space-y-8 scrollbar-none">
          
          {/* Config Row 1: Number and Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClasses}>Room Name / Number</label>
              <input 
                className={inputClasses} 
                value={formData.roomNumber}
                onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                placeholder="e.g. 101"
              />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Room Type</label>
              <div className="relative">
                <select 
                  className={`${inputClasses} appearance-none cursor-pointer`}
                  value={formData.roomType}
                  onChange={e => setFormData({...formData, roomType: e.target.value})}
                >
                  <option value="Standard">Standard</option>
                  <option value="AC">AC Room</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Config Row 2: Capacity */}
          <div className="space-y-2 w-1/2 pr-3">
              <label className={labelClasses}>Bed Capacity</label>
              <input 
                type="number"
                className={inputClasses} 
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                min={1}
              />
          </div>

          {/* Student Assignment Section */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <label className={labelClasses}>Current Occupants ({formData.students.length}/{formData.capacity})</label>
            </div>

            {/* Search Input for Suggestions */}
            <div className="relative" ref={suggestionRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Type student name or email to add..."
                  className={inputClasses + " pl-12"}
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={formData.students.length >= formData.capacity}
                />
              </div>

              {/* Suggestion Dropdown */}
              {showSuggestions && searchQuery.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                  {suggestedStudents.length > 0 ? (
                    suggestedStudents.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={() => addStudent(student)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{student.email}</p>
                        </div>
                        <UserPlus size={16} className="text-slate-300" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                      No matching students found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chips of Assigned Students */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl min-h-[100px] content-start">
              {formData.students.length === 0 ? (
                <div className="m-auto text-center opacity-40">
                   <Users size={32} className="mx-auto mb-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Room is currently vacant</p>
                </div>
              ) : (
                formData.students.map((s) => (
                  <div key={s._id} className="flex items-center gap-2 bg-white border border-slate-200 pl-3 pr-1 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm animate-in zoom-in-95">
                    <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[8px]">
                      {s.name.charAt(0)}
                    </div>
                    {s.name}
                    <button 
                      type="button"
                      onClick={() => removeStudent(s._id)} 
                      className="p-1 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 flex items-center gap-4 bg-slate-50/50">
          {mode === 'edit' && onDelete && (
            <button 
              type="button"
              onClick={() => onDelete(roomData._id)}
              className="p-4 bg-white text-rose-500 border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all shadow-sm"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600">
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => onSave(formData)}
            disabled={!formData.roomNumber}
            className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {mode === 'create' ? 'Confirm Room' : 'Apply Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}