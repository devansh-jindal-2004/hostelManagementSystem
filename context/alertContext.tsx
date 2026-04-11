"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './authContext';

interface Alert {
    _id: string;
    title: string;
    content: string;
    type: 'info' | 'alert' | 'success';
    targetAudience: 'all' | 'students' | 'staff';
    createdBy: { _id: string; name: string; role: string };
    createdAt: string;
}

interface AlertContextType {
    alerts: Alert[];
    loading: boolean;
    fetchAlerts: () => Promise<void>;
    addAlert: (alert: Alert) => void;
    removeAlert: (id: string) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isLoading } = useAuth()

    const fetchAlerts = useCallback(async () => {
        if(isLoading) return
        setLoading(true);

        try {
            let res;
            if (user?.role == "admin") {
                res = await fetch('/api/alert');
            } else {
                res = await fetch(`/api/alert?role=${user?.role}`)
            }

            const data = await res.json();
            if (res.ok) setAlerts(data.alerts);
        } catch (error) {
            toast.error("Failed to fetch alerts");
        } finally {
            setLoading(false);
        }
    }, [isLoading, user]);

    useEffect(() => {
        if (isLoading) return
        if (user) fetchAlerts()
    }, [fetchAlerts])

    const addAlert = (newAlert: Alert) => {
        setAlerts((prev) => [newAlert, ...prev]);
    };

    const removeAlert = async (id: string) => {
        setAlerts((prev) => prev.filter((a) => a._id !== id));
    };

    return (
        <AlertContext.Provider value={{ alerts, loading, fetchAlerts, addAlert, removeAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error("useAlerts must be used within AlertProvider");
    return context;
};