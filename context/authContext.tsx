"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogout";

export type UserRole = 'admin' | 'warden' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: 'male' | 'female' | 'other';
  hostelBlock?: string;
  roomNumber?: string;
  bedNumber?: string;
  phoneNumber: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  registrationNumber?: string;
  department?: string;
  academicYear?: string;
  isProfileComplete: boolean;
  amountDue?: number
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  updateUser: (userData: User) => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { logoutFn } = useLogout()

  // Logic to fetch current user from API
  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    logoutFn()
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, updateUser, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};