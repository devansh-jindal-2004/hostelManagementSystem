"use client";

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { LayoutDashboard, Users, MessageSquare, Bell, LogOut, Menu, User, ChevronDown, Notebook } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UsersProvider } from '@/context/UsersContext';
import { RoomProvider } from '@/context/roomContext';
import { BlockProvider } from '@/context/blockContext';

const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
    { icon: Notebook, label: 'Leaves', href: '/student/leaves' },
    { icon: MessageSquare, label: 'Complaints', href: '/student/complaints' },
    { icon: Bell, label: 'Alerts', href: '/student/announcements' },
];

export default function layout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isLoading) return
        if (user && user.role !== "student") {
            return router.push(`/${user.role}`)
        }
        if (!user) return router.push("/")
    }, [isLoading, user, router])

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar
                navItems={adminNavItems} // (Use the nav items defined previously)
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="lg:ml-64 xl:ml-72 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Student</h1>
                            <p className="text-lg font-bold text-slate-800">HostelGate</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />

                        {/* Profile Dropdown Container */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {user?.name?.charAt(0)}
                                </div>

                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-slate-800 leading-none">{user?.name?.split(' ')[0]}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{user?.role}</p>
                                </div>

                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 py-2 animate-in fade-in zoom-in-95 duration-100">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                    >
                                        <User size={18} />
                                        Profile Settings
                                    </Link>

                                    <div className="h-px bg-slate-100 my-1" />

                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            logout();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-10">
                    <BlockProvider>
                        <RoomProvider>
                                {children}
                        </RoomProvider>
                    </BlockProvider>
                </main>
            </div>
        </div>
    );
}