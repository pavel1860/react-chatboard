import { useEffect } from "react";
import { useAllBranches, useAllTurns, useBranchTurns, useHead } from "../services/artifact-log-service";
import { useAdminStore } from "../stores/admin-store";








const useArtifactLog = () => {
    // const { data: branches, error, isLoading } = useAllBranches({ head_id: headId });
    // const { dataTurns } = useBranchTurns({ head_id: headId })
    const { 
        selectedBranchId, 
        setSelectedBranchId,
        selectedHeadId,
        setSelectedHeadId,
    } = useAdminStore()

    

    const { data: turns, error: turnsError, isLoading: turnsLoading } = useBranchTurns(selectedBranchId ?? null, { head_id: selectedHeadId })
    const { data: head, error: headError, isLoading: headLoading } = useHead(selectedHeadId ?? null, { head_id: selectedHeadId })

    return {
        selectedBranchId,
        setSelectedBranchId,
        selectedHeadId,
        setSelectedHeadId,
        turns,
        turnsError,
        turnsLoading,
        head,
        headError,
        headLoading,
    }
}



export const useHeadEnv = () => {
    const { selectedBranchId, selectedHeadId, setSelectedBranchId, setSelectedHeadId } = useAdminStore()


    return {
        branch_id: selectedBranchId,
        head_id: selectedHeadId,
        setSelectedBranchId,
        setSelectedHeadId,
    }
}




const useTurns = () => {
    const { selectedBranchId, selectedHeadId } = useAdminStore()
    const { data, error, isLoading } = useBranchTurns(selectedBranchId ?? null, { head_id: selectedHeadId })

    return {
        turns: data,
        error,
        loading: isLoading,
    }
}


export { useTurns }

export default useArtifactLog