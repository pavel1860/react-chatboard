//@ts-ignore
export const createArtifactLogSlice = (artifactViews, defaultView = null) => {
    return (set, get) => ({
        selectedBranchId: 1,
        setSelectedBranchId: (branchId) => set({ selectedBranchId: branchId }),
        selectedTurnId: null,
        setSelectedTurnId: (turnId) => set({ selectedTurnId: turnId }),
        mainBranchId: 1,
        setMainBranchId: (mainBranchId) => set({ mainBranchId: mainBranchId }),
        partitionId: null,
        setPartitionId: (partitionId) => set({ partitionId: partitionId }),
        setHeadEnv: (headId, branchId, turnId, mainBranchId) => set({ selectedHeadId: headId, selectedBranchId: branchId, mainBranchId: mainBranchId, selectedTurnId: turnId }),
        setBranchEnv: (branchId, turnId) => set({ selectedBranchId: branchId, selectedTurnId: turnId }),
        artifactView: defaultView,
        setArtifactView: (sideView) => set({ artifactView: sideView }),
        artifactId: null,
        setArtifactId: (artifactId) => set({ artifactId: artifactId }),
        artifactType: null,
        setArtifactType: (artifactId) => set({ artifactType: artifactId }),
    });
};
//# sourceMappingURL=artifact-log-slice.js.map