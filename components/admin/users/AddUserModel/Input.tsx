import React from 'react'

function Input({ change, value, placeHolder, label, type = "text" }: { change: (val: string) => void, value: string|number, placeHolder: string, label: string, type?: string }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.15em] ml-1">{label}</label>
            <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" placeholder={placeHolder} onChange={e => change(e.target.value)} value={value} type={type} />
        </div>
    )
}

export default Input