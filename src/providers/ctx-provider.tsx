import { useStore } from "../store/useStore"
import { useCallback, useContext, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import { CtxContext, useHookCtx } from "../hooks/modelHooks"
import { useSession } from "next-auth/react"
import { useEnsureGuestToken } from "../hooks/auth-hook"


export type AdminCtx = {
    branchId: number,
    partitionId?: string,
    refUserId?: string,
}


export type Ctx = {
    branchId: number,
    partitionId?: string,
    refUserId?: string,
}






export const useCtxUrlParams = () => {
    const params = useParams()
    return {
        branchId: params && params.branchId ? Number(params.branchId) : undefined,
        partitionId: params && params.partitionId ? params.partitionId : undefined,
        userId: params && params.userId ? params.userId : undefined,
        propertyId: params && params.propertyId ? params.propertyId : undefined,
    }
}



export const useAdminUrlParams = () => {
    const params = useParams()
    return {
        partitionId: params?.partitionId ? params.partitionId : null,
        branchId: params?.branchId ? Number(params.branchId) : null,
        refUserId: params?.userId ? params.userId : null,
        traceId: params?.traceId ? params.traceId : null,
        testCaseId: params?.testCaseId ? Number(params.testCaseId) : null,
        testRunId: params?.testRunId ? Number(params.testRunId) : null,
    }
}




export function useSyncUrlParams() {
    const urlParams = useCtxUrlParams()
    const { syncUrlParams } = useStore();

    // Sync Zustand store when URL params change
    useEffect(() => {
        syncUrlParams({
            partitionId: urlParams.partitionId,
            branchId: urlParams.branchId,
            userId: urlParams.userId
        });
    }, [urlParams.partitionId, urlParams.branchId, urlParams.userId, syncUrlParams]);
}


interface CtxProviderProps {
    children: React.ReactNode;
}



const CtxProvider = ({ children }: CtxProviderProps) => {

    const { data: session, status } = useSession()

    const {
        branchId,
        conversationId,
        refUserId,
        setBranchId,
        setRefUserId,
    } = useStore()

    const urlParams = useCtxUrlParams()

    useEnsureGuestToken(status)
    useSyncUrlParams()

    return (
        <CtxContext.Provider value={{
            branchId: branchId,
            partitionId: conversationId,
            refUserId: refUserId,
        }}>
            {children}
        </CtxContext.Provider>
    )
}





const useAdminCtx = () => {
    const ctx = useHookCtx<AdminCtx>()
    const router = useRouter()
    const {
        setBranchId,
        setConversationId,
        setRefUserId,
        isUserListOpen,
        setIsUserListOpen,
    } = useStore()


    const setConversationIdAux = useCallback((partitionId: string) => {
        if (ctx.refUserId) {
            setConversationId(partitionId)
            router.push(`/admin/user/${ctx.refUserId}/conversation/${partitionId}`)
        } else {
            throw new Error("Ref user id is required to set conversation id")
        }
    }, [setConversationId, router])

    return {
        ...ctx,
        setBranchId,
        setRefUserId: setRefUserId,
        setConversationId: setConversationIdAux,
        refUserId: ctx.refUserId,
        partitionId: ctx.partitionId,
        isUserListOpen,
        setIsUserListOpen,
    }
}



const useCtx = () => {
    const ctx = useHookCtx<Ctx>()
    const router = useRouter()
    const {
        setBranchId,
        setConversationId,
        setRefUserId,
    } = useStore()


    const setConversationIdAux = useCallback((partitionId: string) => {
        setConversationId(partitionId)
        router.push(`/conversation/${partitionId}`)
    }, [setConversationId, router])

    return {
        ...ctx,
        setBranchId,
        setConversationId: setConversationIdAux,
        partitionId: ctx.partitionId,
    }
}



export {
    CtxProvider,
    useCtx,
    useAdminCtx,
}