import { EditorValue } from "../components/editor/util"
import { IMessage, Role, useChatEndpoint } from "../services/chatbot-service"
import React, { use, useCallback, useEffect } from "react"



interface ChatState {
    messages: IMessage[]
    loading: boolean
    error: any
    sending: boolean
    sendMessage: (content: EditorValue, fromMessageId?: string) => void
    deleteMessage: (id: string) => void
    refetch: () => void
    setLimit: (limit: number) => void
    setOffset: (offset: number) => void
    fetchMore: () => void    
}



const optimisticMessage = (content: string, phoneNumber: string): IMessage => {

    return {
        id: "temp-id",
        input: "",
        output: content,
        metadata: {
            prompt: undefined,
            role: Role.CLIENT,
            run_id: undefined,
            phone_number: phoneNumber,
            manager_phone_number: ""
        },
        asset_input_date: undefined,
        asset_output_date: new Date().toISOString(),
        asset_update_ts: Date.now()
    }
}


export const useChatBot = (selectedPhoneNumber: string): ChatState => {


    const [limit, setLimit] = React.useState<number>(10)
    const [offset, setOffset] = React.useState<number>(0)
    const [sending, setSending] = React.useState<boolean>(false)    

    const {
        data,
        mutate,
        error,
        isLoading,
        size,
        setSize,
        refetch
    } = useChatEndpoint(selectedPhoneNumber, limit)


    const dataRef = React.useRef(data)

    const fetchMore = () => {
        //@ts-ignore
        setSize(size => size + 1)       
    }

    useEffect(() => {
        // dataRef.current = data.filter((msg: IMessage) => msg.id !== "temp-id")
        dataRef.current = data
    }, [data])


    // useEffect(() => {
    //     if (clientProfileService.lastUpdate){
    //         refetch()
    //     }
    // }, [clientProfileService.lastUpdate])
    


    const sendMessageRequest = async (content: string, data: IMessage[], fromMessageId?: string) => {
        console.log("################ content", content)
        if (!content) {
            throw new Error("Message content is empty.");
            
        }
        const res = await fetch(`/api/debug/${selectedPhoneNumber}/chat`, {
            method: "POST",
            body: JSON.stringify({ content, fromMessageId }),
            // body: { content: content },
            headers: {
                "Content-Type": "application/json"
            }
        })
        const msg = await res.json()        
        if (res.ok) {            
            const newThread = [...msg, ...data]
            console.log("######new thread", newThread)
            return newThread
        } else {
            throw new Error("Failed to send message.");
            
        }
    }


    const deleteMessageRequest = async (id: string, data: IMessage[]) => {
        const res = await fetch(`/api/debug/${selectedPhoneNumber}/chat/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (res.ok) {
            return data.filter((msg: IMessage) => msg.id !== id)
        } else {
            throw new Error("Failed to delete message.");
        }
    }


    const filterMessagesFromId = (data: IMessage[], fromMessageId: string) => {
        const index = data.findIndex((msg: IMessage) => msg.id === fromMessageId)
        return data.slice(index)
    }


    const sendMessage = useCallback(async (content: EditorValue, fromMessageId?: string) => {
        try {
            if (!selectedPhoneNumber) {
                return
            }
            setSending(true)
            console.log("#### curr", dataRef.current)
            const oldData = [...dataRef.current]            
            const optimisticData = [optimisticMessage(content.text, selectedPhoneNumber), ...(fromMessageId ? filterMessagesFromId(oldData, fromMessageId) : oldData)]
            await mutate(sendMessageRequest(content.text, oldData, fromMessageId), {
                optimisticData: optimisticData,
            });
            setSending(false)
        } catch (error) {
            console.error(error)
            setSending(false)
        }
    }, [data, selectedPhoneNumber])


    const deleteMessage = useCallback(async (id: string) => {
        try {
            if (!selectedPhoneNumber) {
                return
            }
            setSending(true)
            const oldData = [...dataRef.current]
            await mutate(deleteMessageRequest(id, oldData), {
                optimisticData: oldData.filter((msg: IMessage) => msg.id !== id),
            });
            setSending(false)
        } catch (error) {
            console.error(error)
            setSending(false)
        }
    }, [data, selectedPhoneNumber])
    

    return {
        messages: data || [],
        loading: isLoading,
        sending: sending,
        error: error,
        sendMessage,
        deleteMessage,
        fetchMore,
        refetch,
        setLimit: setLimit,
        setOffset: setOffset,
    }

}