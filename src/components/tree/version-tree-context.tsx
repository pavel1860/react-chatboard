import React, { createContext, useContext, useState } from 'react';

interface VersionTreeContextType {
    expandedTurns: Set<number>;
    toggleTurn: (turnId: number) => void;
    isExpanded: (turnId: number) => boolean;
    refetchChat?: () => void;
    branchId: number;
    setBranchId: (branchId: number) => void;
    setTraceId: (traceId: string) => void;
    partitionId: string;
}

const VersionTreeContext = createContext<VersionTreeContextType | undefined>(undefined);

export function VersionTreeProvider({ children, refetchChat, branchId, setBranchId, setTraceId, partitionId }: { children: React.ReactNode, refetchChat?: () => void, branchId: number, setBranchId: (branchId: number) => void, setTraceId: (traceId: string) => void, partitionId: string }) {    
    const [expandedTurns, setExpandedTurns] = useState<Set<number>>(new Set());

    const toggleTurn = (turnId: number) => {
        setExpandedTurns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(turnId)) {
                newSet.delete(turnId);
            } else {
                newSet.add(turnId);
            }
            return newSet;
        });
    };

    const isExpanded = (turnId: number) => expandedTurns.has(turnId);

    return (
        <VersionTreeContext.Provider value={{ expandedTurns, toggleTurn, isExpanded, refetchChat, branchId, setBranchId, setTraceId, partitionId }}>
            {children}
        </VersionTreeContext.Provider>
    );
}

export function useVersionTree() {
    const context = useContext(VersionTreeContext);
    if (context === undefined) {
        throw new Error('useVersionTree must be used within a VersionTreeProvider');
    }
    return context;
} 