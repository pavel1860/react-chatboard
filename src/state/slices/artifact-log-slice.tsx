import { BranchType, HeadType } from "@/src/services/artifact-log-service"




export type ArtifactLogStoreType = {
    selectedHeadId: number | null
    setSelectedHeadId: (headId: number) => void
    selectedBranchId: number | null
    setSelectedBranchId: (branchId: number) => void
}


//@ts-ignore
export const createArtifactLogSlice = (set, get): ArtifactLogStoreType => ({
    selectedHeadId: 1,    
    setSelectedHeadId: (headId: number) => set({ selectedHeadId: headId }),
    selectedBranchId: null,
    setSelectedBranchId: (branchId: number) => set({ selectedBranchId: branchId }),
})