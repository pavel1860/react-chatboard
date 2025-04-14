import { BranchType, HeadType } from "@/src/model/services/artifact-log-service"




export type ArtifactLogStoreType = {
    selectedBranchId: number | null
    setSelectedBranchId: (branchId: number) => void
    selectedTurnId: number | null
    setSelectedTurnId: (turnId: number) => void
    mainBranchId: number | null
    setMainBranchId: (mainBranchId: number) => void
    partitionId: number | null
    setPartitionId: (partitionId: number | null) => void
    setHeadEnv: (headId: number, branchId: number, mainBranchId: number, turnId: number) => void
    setBranchEnv: (branchId: number, turnId: number) => void

    artifactView: string | null
    setArtifactView: (sideView: string | null) => void
    artifactId: string | null
    setArtifactId: (artifactId: string | null) => void
    artifactType: string | null
    setArtifactType: (artifactId: string | null) => void
}


//@ts-ignore
export const createArtifactLogSlice = (artifactViews: string[], defaultView: string | null = null) => {

        return (set: any, get: any): ArtifactLogStoreType => ({
            selectedBranchId: 1,
            setSelectedBranchId: (branchId: number) => set({ selectedBranchId: branchId }),
            selectedTurnId: null,
            setSelectedTurnId: (turnId: number) => set({ selectedTurnId: turnId }),
            mainBranchId: 1,
            setMainBranchId: (mainBranchId: number) => set({ mainBranchId: mainBranchId }),
            partitionId: null,
            setPartitionId: (partitionId: number | null) => set({ partitionId: partitionId }),
            setHeadEnv: (headId: number, branchId: number, turnId: number, mainBranchId: number) => set({ selectedHeadId: headId, selectedBranchId: branchId, mainBranchId: mainBranchId, selectedTurnId: turnId }),
            setBranchEnv: (branchId: number, turnId: number) => set({ selectedBranchId: branchId, selectedTurnId: turnId }),
            artifactView: defaultView,
            setArtifactView: (sideView: string | null) => set({ artifactView: sideView }),
            artifactId: null,
            setArtifactId: (artifactId: string | null) => set({ artifactId: artifactId }),
            artifactType: null,
            setArtifactType: (artifactId: string | null) => set({ artifactType: artifactId }),
    })
}