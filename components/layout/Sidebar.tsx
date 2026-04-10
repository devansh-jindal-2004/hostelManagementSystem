"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  navItems: { icon: LucideIcon; label: string; href: string }[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ navItems, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-lg italic">H</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">HostelGate</span>
          </div>
          
          {/* Close button for mobile */}
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = (pathname === item.href) || (pathname.includes("/admin/blocks") && item.href === "/admin/blocks");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close on click
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={19} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-40" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}