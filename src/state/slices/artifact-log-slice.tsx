import { BranchType, HeadType } from "@/src/services/artifact-log-service"


export type SideViewType = "version-tree" | "test-case"

export type ArtifactLogStoreType = {
    selectedHeadId: number | null
    setSelectedHeadId: (headId: number) => void
    selectedBranchId: number | null
    setSelectedBranchId: (branchId: number) => void
    selectedTurnId: number | null
    setSelectedTurnId: (turnId: number) => void
    mainBranchId: number | null
    setMainBranchId: (mainBranchId: number) => void
    setHeadEnv: (headId: number, branchId: number, mainBranchId: number) => void
    sideView: SideViewType
    setSideView: (sideView: SideViewType) => void
}


//@ts-ignore
export const createArtifactLogSlice = (set, get): ArtifactLogStoreType => ({
    selectedHeadId: 1,    
    setSelectedHeadId: (headId: number) => set({ selectedHeadId: headId }),
    selectedBranchId: null,
    setSelectedBranchId: (branchId: number) => set({ selectedBranchId: branchId }),
    selectedTurnId: null,
    setSelectedTurnId: (turnId: number) => set({ selectedTurnId: turnId }),
    mainBranchId: null,
    setMainBranchId: (mainBranchId: number) => set({ mainBranchId: mainBranchId }),
    setHeadEnv: (headId: number, branchId: number, mainBranchId: number) => set({ selectedHeadId: headId, selectedBranchId: branchId, mainBranchId: mainBranchId }),
    sideView: "version-tree",
    setSideView: (sideView: SideViewType) => set({ sideView: sideView }),
})