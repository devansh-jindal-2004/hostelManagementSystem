"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Block {
  _id: string;
  name: string;
  type: 'Boys' | 'Girls';
  warden: {
    _id: string;
    name: string;
  };
  totalBeds: number;
  occupiedBeds: number;
}

interface BlockContextType {
  blocks: Block[];
  loading: boolean;
  refreshBlocks: () => Promise<void>;
  addBlock: (newBlock: Block) => void;
  updateBlock: (updatedBlock: Block) => void;
  removeBlock: (id: string) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export function BlockProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/block');
      const data = await res.json();
      if (res.ok) {
        setBlocks(data.blocks);
      } else {
        toast.error(data.message || "Failed to fetch blocks");
      }
    } catch (error) {
      toast.error("Something went wrong refresh to load again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const addBlock = (newBlock: Block) => {
    setBlocks((prev) => [newBlock, ...prev]);
  };

  const updateBlock = (updatedBlock: Block) => {
    setBlocks((prev) => 
      prev.map((b) => (b._id === updatedBlock._id ? updatedBlock : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <BlockContext.Provider value={{ 
      blocks, 
      loading, 
      refreshBlocks: fetchBlocks, 
      addBlock, 
      updateBlock, 
      removeBlock 
    }}>
      {children}
    </BlockContext.Provider>
  );
}

export const useBlocks = () => {
  const context = useContext(BlockContext);
  if (!context) throw new Error("useBlocks must be used within a BlockProvider");
  return context;
};