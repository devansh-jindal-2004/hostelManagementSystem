"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface Complaint {
    _id: string;
    title: string;
    description: string;
    category: "Electrical" | "Plumbing" | "Internet" | "Furniture" | "Cleaning" | "Other";
    severity: "Low" | "Medium" | "High" | "Critical";
    status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated";
    createdAt: string;
    room: {
        _id: string;
        roomNumber: string;
    };
    block: {
        _id: string;
        blockName: string;
    };
}

interface ComplaintContextType {
    complaints: Complaint[];
    loading: boolean;
    fetchComplaints: () => void;
    createComplaint: (comp: Complaint) => void;
    updateComplaint: (id: string, status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated") => void
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/complaint")
            const result = await res.json()

            if (!res.ok) {
                toast.error(result.message || "Something Went Wrong")
            }

            if (!result.complaints) return toast.error("Network Error")

            setComplaints(result.complaints)
        } catch (error) {
            console.log("ERROR_FETCHING_COMPLAINTS")
            toast.error("Internal Server Error")
        } finally {
            setLoading(false)
        }
    }

    const createComplaint = (comp: Complaint) => {
        setComplaints(prev => ([...prev, comp]))
    };

    const updateComplaint = (id: string, status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated") => {
        setComplaints(prev => ([...prev.map(c => c._id !== id ? c : { ...c, status: status })]))
    }

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <ComplaintContext.Provider
            value={{
                complaints,
                loading,
                fetchComplaints,
                createComplaint,
                updateComplaint
            }}
        >
            {children}
        </ComplaintContext.Provider>
    );
};

export const useComplaints = () => {
    const context = useContext(ComplaintContext);
    if (!context) {
        throw new Error("useComplaints must be used within a ComplaintProvider");
    }
    return context;
};