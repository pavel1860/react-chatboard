import { useEffect } from "react";
import { useAllBranches, useAllTurns, useBranchTurns, useHead } from "../services/artifact-log-service";
import { useChatStore } from "../../stores/chat-store";
import { useMutationHook } from "../../services/mutation";
import { HeadType } from "../services/artifact-log-service";
import { VersionEnv } from "@/src/services/fetcher2";













export const useHeadEnv = (env: VersionEnv | null = null) => {

    const selectedBranchId = useChatStore((state) => state.selectedBranchId)
    const setSelectedBranchId = useChatStore((state) => state.setSelectedBranchId)
    const selectedTurnId = useChatStore((state) => state.selectedTurnId)
    const setSelectedTurnId = useChatStore((state) => state.setSelectedTurnId)
    const mainBranchId = useChatStore((state) => state.mainBranchId)
    const setMainBranchId = useChatStore((state) => state.setMainBranchId)
    const partitionId = useChatStore((state) => state.partitionId)
    const setPartitionId = useChatStore((state) => state.setPartitionId)
    const setHeadEnv = useChatStore((state) => state.setHeadEnv)
    const setBranchEnv = useChatStore((state) => state.setBranchEnv)


    return {
        branchId: env?.branchId || selectedBranchId,
        setBranchId: setSelectedBranchId,
        turnId: env?.turnId || selectedTurnId,
        setTurnId: setSelectedTurnId,
        mainBranchId: mainBranchId,
        setMainBranchId,
        setHeadEnv,
        setBranchEnv,
        partitionId: env?.partitionId || partitionId,
        setPartitionId,
        // changeHead: (headId: number) => {
        //     changeHead({head_id: headId})
        // },       
        // changeHeadIsMutating,
        // changeHeadError,
    }
}




// export function useChangeHead(
//     baseUrl: string = "/api/ai/users",     
// ) {
//     const env = useHeadEnv()
    
//     const { trigger, isMutating, error } = useMutationHook<{head_id: number, branch_id?: number}, HeadType>({ 
//         // schema: UserSchema, 
//         endpoint: `${baseUrl}/Manager/change-head`, 
//         env,
//         callbacks: {
//             onSuccess: (data) => {
//                 console.log("onSuccess", data)
//                 // env.setSelectedHeadId(data.id)                    
//                 // env.setSelectedBranchId(data.branch_id)                    
//                 env.setHeadEnv(data.id, data.branch_id, data.main_branch_id)
//             }
//         }
//     });

//     return {
//         changeHead: (headId: number) => {
//             trigger({head_id: headId})
//         },
//         isMutating,
//         error,
//     }
// }





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
    const { selectedBranchId, selectedHeadId } = useChatStore()
    const { data, error, isLoading } = useBranchTurns(selectedBranchId ?? null, { head_id: selectedHeadId })

    return {
        turns: data,
        error,
        loading: isLoading,
    }
}


export { useTurns }

// export default useArtifactLog