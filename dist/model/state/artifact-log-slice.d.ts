export type ArtifactLogStoreType = {
    selectedBranchId: number | null;
    setSelectedBranchId: (branchId: number) => void;
    selectedTurnId: number | null;
    setSelectedTurnId: (turnId: number) => void;
    mainBranchId: number | null;
    setMainBranchId: (mainBranchId: number) => void;
    partitionId: string | null;
    setPartitionId: (partitionId: string | null) => void;
    setHeadEnv: (headId: number, branchId: number, mainBranchId: number, turnId: number) => void;
    setBranchEnv: (branchId: number, turnId: number) => void;
    artifactView: string | null;
    setArtifactView: (sideView: string | null) => void;
    artifactId: string | null;
    setArtifactId: (artifactId: string | null) => void;
    artifactType: string | null;
    setArtifactType: (artifactId: string | null) => void;
};
export declare const createArtifactLogSlice: (artifactViews: string[], defaultView?: string | null) => (set: any, get: any) => ArtifactLogStoreType;
//# sourceMappingURL=artifact-log-slice.d.ts.map