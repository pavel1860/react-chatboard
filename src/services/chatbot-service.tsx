import { fetcher, ServiceHook, ServiceInfiniteHook, ServiceMutationHook, fetchWithResponse, useMutation } from "./fetcher";
import { AssetItem } from "./chatboard-service";
import useSWRInfinite from "swr/infinite";



type MessageInput = string
type MessageOutput = string

export enum Role {
    CLIENT = "user",
    MANAGER = "manager",
    BOT = "assistant"
}

interface MessageMetadata {
    prompt?: string
    role: Role
    run_id?: string
    phone_number: string
    manager_phone_number: string
    // size: number
    // setSize: (size: number) => void
}


export type IMessage = AssetItem<MessageInput, MessageOutput, MessageMetadata>

interface ChatHook extends ServiceInfiniteHook<IMessage[]>{
    refetch: () => void
}











export function useChatEndpoint(phoneNumber: string | null, limit: number = 10): ChatHook{

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (!phoneNumber) return null
        if (previousPageData && !previousPageData.length) return null // reached the end
        const params = new URLSearchParams()
        params.set('page', `${pageIndex}`)
        params.set('limit', `${limit}`)
        params.set('phone_number', phoneNumber)
        if (previousPageData && previousPageData.length)
            params.set('start_from', `${previousPageData[previousPageData.length - 1].asset_update_ts}`)      
        return `client/${phoneNumber}/chat?${params.toString()}`
    }
    const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
        getKey, fetchWithResponse
    )

    const refetch = () => {
        setSize(1)
    }
    return {
        data: data ? data.flat() : [],
        mutate,
        error,
        isLoading,
        size,
        setSize,
        refetch
    }
}



export function useChatDelete(){

    const { isMutating, trigger } = useMutation(`/debug/chat`, {
        method: "DELETE",
        onSuccess: () => {
            console.log("Deleted message")
        },
        onError: (error) => {
            console.error(error)
        }
    })
    return {
        isMutating,
        deleteMessage: (phoneNumber: string, messageId: string) => trigger({ phoneNumber, messageId })
    }
}


export function useChatSendMessage(phoneNumber: string | null){
    // const { } = useMutation("/")
}

