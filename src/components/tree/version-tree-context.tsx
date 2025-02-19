import React, { createContext, useContext, useState } from 'react';

interface VersionTreeContextType {
    expandedTurns: Set<number>;
    toggleTurn: (turnId: number) => void;
    isExpanded: (turnId: number) => boolean;
}

const VersionTreeContext = createContext<VersionTreeContextType | undefined>(undefined);

export function VersionTreeProvider({ children }: { children: React.ReactNode }) {
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
        <VersionTreeContext.Provider value={{ expandedTurns, toggleTurn, isExpanded }}>
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