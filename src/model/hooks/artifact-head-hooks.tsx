import { useBranchTurns } from "../services/artifact-log-service";
import { useChatStore } from "../../stores/chat-store";
import { VersionEnv } from "@/src/services/fetcher2";








export type HeadEnvType = {

}




export const useHeadEnv = (env: VersionEnv | null = null) => {

    const barnchId = useChatStore((state) => state.selectedBranchId)
    const setBranchId = useChatStore((state) => state.setSelectedBranchId)
    const turnId = useChatStore((state) => state.selectedTurnId)
    const setTurnId = useChatStore((state) => state.setSelectedTurnId)
    const partitionId = useChatStore((state) => state.partitionId)
    const setPartitionId = useChatStore((state) => state.setPartitionId)


    return {
        branchId: env?.branchId || barnchId,
        setBranchId: setBranchId,
        turnId: env?.turnId || turnId,
        setTurnId: setTurnId,
        partitionId: env?.partitionId || partitionId,
        setPartitionId,        
    }
}





export const useVersionHead = (head?: VersionEnv) => {

    const { branchId, turnId, mainBranchId, partitionId } = useHeadEnv(head)

    return {
        branchId,
        turnId,
        partitionId,
    }
}




// export const usePara

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