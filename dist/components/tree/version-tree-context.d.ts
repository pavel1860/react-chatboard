import React from 'react';
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
export declare function VersionTreeProvider({ children, refetchChat, branchId, setBranchId, setTraceId, partitionId }: {
    children: React.ReactNode;
    refetchChat?: () => void;
    branchId: number;
    setBranchId: (branchId: number) => void;
    setTraceId: (traceId: string) => void;
    partitionId: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function useVersionTree(): VersionTreeContextType;
export {};
//# sourceMappingURL=version-tree-context.d.ts.map