import { IMessage, Role, useChatEndpoint } from "../services/chatbot-service"
import React, { use, useCallback, useEffect } from "react"



interface ChatState {
    messages: IMessage[]
    loading: boolean
    error: any
    sending: boolean
    sendMessage: (content: string) => void
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

    const fetchMore = () => {
        //@ts-ignore
        setSize(size => size + 1)       
    }


    // useEffect(() => {
    //     if (clientProfileService.lastUpdate){
    //         refetch()
    //     }
    // }, [clientProfileService.lastUpdate])
    


    // const sendMessageRequest = async (content: string) => {
    //     console.log("################ content", content)
    //     const res = await fetch(`/api/debug/${selectedPhoneNumber}/chat`, {
    //         method: "POST",
    //         body: JSON.stringify({ content }),
    //         // body: { content: content },
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     })
    //     const msg = await res.json()        
    //     if (res.ok) {
    //         // console.log(data)
    //         return [msg, ...data]
    //     } else {
    //         throw new Error("Failed to send message.");
            
    //     }
    // }

    // const sendMessage = async (content: string) => {
    //     try {
    //         if (!selectedPhoneNumber) {
    //             return
    //         }
    //         setSending(true)
    //         await mutate(sendMessageRequest(content), {
    //             optimisticData: [optimisticMessage(content, selectedPhoneNumber), ...data],                
    //         });
    //         setSending(false)
    //     } catch (error) {
    //         console.error(error)
    //         setSending(false)
    //     }
    // }

    const sendMessageRequest = useCallback(async (content: string) => {
        console.log("################ content", content)
        const res = await fetch(`/api/debug/${selectedPhoneNumber}/chat`, {
            method: "POST",
            body: JSON.stringify({ content }),
            // body: { content: content },
            headers: {
                "Content-Type": "application/json"
            }
        })
        const msgs = await res.json()        
        if (res.ok) {
            // console.log(data)
            return [...msgs, ...data]
        } else {
            throw new Error("Failed to send message.");
            
        }
    }, [data, selectedPhoneNumber])

    const sendMessage = useCallback(async (content: string) => {
        try {
            if (!selectedPhoneNumber) {
                return
            }
            setSending(true)
            await mutate(sendMessageRequest(content), {
                optimisticData: [optimisticMessage(content, selectedPhoneNumber), ...data],                
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
        fetchMore,
        refetch,
        setLimit: setLimit,
        setOffset: setOffset,
    }

}