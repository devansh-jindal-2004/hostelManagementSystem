"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { User } from './authContext';
import { toast } from 'sonner';

export type UserRole = 'student' | 'warden' | 'admin';

interface UsersContextType {
    users: User[];
    activeTab: UserRole;
    setActiveTab: (role: UserRole) => void;
    loading: boolean;
    setUsers: Dispatch<SetStateAction<User[]>>
    updateUser: (users: User) => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<UserRole>('student');
    const [loading, setLoading] = useState(false);

    // Fetch Logic
    const fetchUsers = async () => {
        setLoading(true);
        try {

            const res = await fetch(`/api/admin/users`);
            const data = await res.json();

            if (!res.ok) return toast.error(data.message)

            setUsers(data.users);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when tab or page changes
    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    // Reset page when switching tabs or searching
    const handleTabChange = (role: UserRole) => {
        setActiveTab(role);
    };

    const updateUser = (user: User) => {
        setUsers(prev => ([...prev.map(u => u._id === user._id ? user : u)]))
    }

    return (
        <UsersContext.Provider value={{
            users,
            activeTab,
            setActiveTab: handleTabChange,
            loading,
            setUsers,
            updateUser
        }}>
            {children}
        </UsersContext.Provider>
    );
}

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) throw new Error("useUsers must be used within a UsersProvider");
    return context;
};