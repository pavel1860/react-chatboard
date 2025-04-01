import React, { createContext, useContext, useState } from 'react';

interface VersionTreeContextType {
    expandedTurns: Set<number>;
    toggleTurn: (turnId: number) => void;
    isExpanded: (turnId: number) => boolean;
    refetchChat: () => void;
}

const VersionTreeContext = createContext<VersionTreeContextType | undefined>(undefined);

export function VersionTreeProvider({ children, refetchChat }: { children: React.ReactNode, refetchChat: () => void }) {
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
        <VersionTreeContext.Provider value={{ expandedTurns, toggleTurn, isExpanded, refetchChat }}>
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