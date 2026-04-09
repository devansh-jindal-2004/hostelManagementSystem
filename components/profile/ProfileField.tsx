import React from 'react';

interface FieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  type?: string;
  placeholder?: string;
  change: (value: string) => void
}

export default function ProfileField({ label, value, isEditing, type = "text", placeholder, change }: FieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      {isEditing ? (
        <input 
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          onChange={e => change(e.target.value)}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
        />
      ) : (
        <p className="text-base font-bold text-slate-700 px-1 py-1 min-h-10 flex items-center">
          {value || "—"}
        </p>
      )}
    </div>
  );
}