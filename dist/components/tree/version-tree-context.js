import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const VersionTreeContext = createContext(undefined);
export function VersionTreeProvider({ children, refetchChat, branchId, setBranchId, setTraceId, partitionId }) {
    const [expandedTurns, setExpandedTurns] = useState(new Set());
    const toggleTurn = (turnId) => {
        setExpandedTurns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(turnId)) {
                newSet.delete(turnId);
            }
            else {
                newSet.add(turnId);
            }
            return newSet;
        });
    };
    const isExpanded = (turnId) => expandedTurns.has(turnId);
    return (_jsx(VersionTreeContext.Provider, { value: { expandedTurns, toggleTurn, isExpanded, refetchChat, branchId, setBranchId, setTraceId, partitionId }, children: children }));
}
export function useVersionTree() {
    const context = useContext(VersionTreeContext);
    if (context === undefined) {
        throw new Error('useVersionTree must be used within a VersionTreeProvider');
    }
    return context;
}
//# sourceMappingURL=version-tree-context.js.map