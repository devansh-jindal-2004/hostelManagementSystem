import { ChevronDown } from 'lucide-react';

export const FormInput = ({ label, placeholder, value, onChange, type = "text" }:{label: string, placeholder?: string, value: string, onChange: (val: string) => void, type?: string}) => (
  <div className="space-y-2 flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={e => onChange(e.target.value)}
      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
    />
  </div>
);

export const FormSelect = ({ label, options, ...props }: any) => (
  <div className="space-y-2 flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <select
        {...props}
        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
    </div>
  </div>
);