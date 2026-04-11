"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Room {
  _id: string;
  roomNumber: string;
  block: string;
  capacity: number;
  students: string[];
}

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  fetchRooms: (blockId?: string) => Promise<void>;
  createRoom: (room: Room) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch rooms for a specific block
  const fetchRooms = async (blockId?: string) => {
    setLoading(true);
    try {
      let res;
      if(blockId){
        res = await fetch(`/api/admin/room?blockId=${blockId}`);
      } else {
        res = await fetch("/api/admin/room")
      }
      const data = await res.json();
      if (res.ok) {
        console.log(data.rooms);
        
        setRooms(data.rooms);
      } else {
        toast.error(data.message || "Failed to load rooms");
      }
    } catch {
      toast.error("Connection error while fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  // 2. Create Room
  const createRoom = async (room: Room) => {
    setRooms(prev => ([...prev, room]))
  };

  // 3. Update Room
  const updateRoom = async (room: Room) => {
    setRooms(prev => ([...prev.map(r => r._id === room._id ? room : r)]))
  };

  // 4. Delete Room
  const deleteRoom = async (roomId: string) => {
    setRooms(prev => ([...prev.filter(r => r._id !== roomId)]))
  };

  return (
    <RoomContext.Provider value={{
      rooms,
      loading,
      fetchRooms,
      createRoom,
      updateRoom,
      deleteRoom
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useRooms must be used within a RoomProvider");
  return context;
};