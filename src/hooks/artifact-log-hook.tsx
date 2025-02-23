import { useEffect } from "react";
import { useAllBranches, useAllTurns, useBranchTurns, useHead } from "../services/artifact-log-service";
import { useAdminStore } from "../stores/admin-store";




export const useHeadEnv = () => {
    const { 
        selectedBranchId, 
        selectedHeadId, 
        setSelectedBranchId, 
        setSelectedHeadId,
        mainBranchId,
        setMainBranchId,
        setHeadEnv,
    } = useAdminStore()


    return {
        branchId: selectedBranchId,
        headId: selectedHeadId,
        setBranchId: setSelectedBranchId,
        setHeadId: setSelectedHeadId,
        mainBranchId,
        setMainBranchId,
        setHeadEnv,
    }
}




// const useArtifactLog = () => {
//     // const { data: branches, error, isLoading } = useAllBranches({ head_id: headId });
//     // const { dataTurns } = useBranchTurns({ head_id: headId })
//     // const { 
//     //     selectedBranchId, 
//     //     setSelectedBranchId,
//     //     selectedHeadId,
//     //     setSelectedHeadId,
//     // } = useAdminStore()
//     const {
//         branchId,
//         headId,
//         setBranchId,
//         setHeadId,
//     } = useHeadEnv()
    

//     const { data: turns, error: turnsError, isLoading: turnsLoading } = useBranchTurns(branchId ?? null)
//     const { data: head, error: headError, isLoading: headLoading } = useHead(headId ?? null, { head_id: headId })

//     return {
//         branchId,
//         setBranchId,
//         headId,
//         setHeadId,
//         turns,
//         turnsError,
//         turnsLoading,
//         head,
//         headError,
//         headLoading,
//     }
// }







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

// export default useArtifactLog