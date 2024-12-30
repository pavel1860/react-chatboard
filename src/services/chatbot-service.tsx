// import { fetcher, ServiceHook, ServiceInfiniteHook, ServiceMutationHook, fetchWithResponse, useMutation } from "./fetcher";
import { fetcher, fetcherWithHeaders } from "./fetcher2";
import useSWRInfinite from "swr/infinite";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorValue } from "../components/editor/util";
import useSWRSubscription from "swr/subscription";
import { IMessage, Role } from "./types";
import { useModelEnv } from "../state/model-env";











const buildParams = (phoneNumber: string, limit: number, startFrom?: string) => {
    const params = new URLSearchParams()
    params.set('limit', `${limit}`)
    params.set('phone_number', phoneNumber)
    if (startFrom)
        params.set('start_from', startFrom)
    return params
}


function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}





export function useChatSubscription(userId: string) {

    const { data, error } = useSWRSubscription(`ws://skynet:8001/subscribe/socket?user_id=${userId}`, (key, { next }) => {
        const socket = new WebSocket(key)
        socket.addEventListener('message', (event) => {
            console.log("##message##", event.data)
            return next(null, JSON.parse(event.data))
        })
        socket.addEventListener('error', (event) => {
            console.log("##error##", event)
            //@ts-ignore
            next(event.error)
        })
        
        return () => socket.close()
    })


    return {
        data,
        error
    }

}



export function useInfiniteChat(phoneNumber: string | null, sessionId: string | null) {
    // const { phoneNumber, sessionId } = useSelectedPhoneNumber()
    const limit = 30

    const prevPhoneNumber = usePrevious(phoneNumber);

    useEffect(() => {
        if (prevPhoneNumber !== phoneNumber) {
            console.log("phoneNumber changed", prevPhoneNumber, "->", phoneNumber);
        }
    }, [phoneNumber])


    const {
        selectedEnv: env
    } = useModelEnv();


    const getKey = (pageIndex: number, previousPageData: any) => {
        if (!phoneNumber) return null
        if (previousPageData && !previousPageData.length) return null // reached the end
        const params = new URLSearchParams()
        params.set('page', `${pageIndex}`)
        params.set('limit', `${limit}`)
        params.set('phone_number', phoneNumber)
        params.set('tool_msgs', "true") 
        if (sessionId)
            params.set('session_id', sessionId)
        if (previousPageData && previousPageData.length){
            let d = new Date(previousPageData[previousPageData.length - 1].created_at)
            const currentMilliseconds = d.getMilliseconds();
            d.setMilliseconds(currentMilliseconds - 1);                        
            params.set('start_from', d.toISOString())
            // params.set('start_from', `${previousPageData[previousPageData.length - 1].created_at - 1}`)
        }
        return `api/client/${phoneNumber}/chat?${params.toString()}`
    }

    const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
        getKey,
        fetcherWithHeaders({env})
    )

    useEffect(() => {
        console.log("### data changed", data)
    }, [data])


    const flattenedData = useMemo(() => (data ? data.flat() : []), [data]);


    return {
        data: flattenedData || [],
        mutate,
        error,
        isLoading,
        size,
        setSize,
        refetch: () => setSize(1)
    }
}


export function useChatMessages(phoneNumber: string | null, sessionId: string | null) {
    // const messages = usePlayGroundStore(state => state.messages)
    // const setMessages = usePlayGroundStore(state => state.setMessages)
    const [messages, setMessages] = useState<IMessage[]>([])

    // const {phoneNumber} = useSelectedPhoneNumber()
    // const phoneNumber = usePlayGroundStore(state => state.phoneNumber)
    // const limit = usePlayGroundStore(state => state.limit)
    const limit = 10
    
    const {data, isLoading, size, setSize} = useInfiniteChat(phoneNumber, sessionId)
    const { data: subData, error: subError} = useChatSubscription("11111111")

    // console.log("#### useSWRInfinite", isLoading, data)


    const prevData = usePrevious(data);

    useEffect(() => {
        // if(data && !isValidating){
        if (data) {
            console.log("#### setting messages: prev", prevData)
            console.log("#### setting messages", data)
            setMessages(data)
        }
    }, [data])


    useEffect(() => {  
        if (subData) {
            console.log("#### subData", subData)
            setMessages([subData, ...messages])
        }

    }, [subData])
    // }, [data.map((d: any) => d.id)])


    const refetch = () => {
        setSize(1)
    }

    const fetchMore = () => {
        //@ts-ignore
        setSize(size => size + 1)
        console.log("#### size change!", size)
    }

    return {
        messages: messages,        
        isLoading,        
        refetch,
        fetchMore
    }
}





const filterMessagesFromId = (data: IMessage[], fromMessageId: string) => {
    const index = data.findIndex((msg: IMessage) => msg.id === fromMessageId)
    const filterdData = data.slice(index)
    return filterdData
}


const optimisticMessage = (content: string, phoneNumber: string): IMessage => {

    return {
        id: "temp-id",        
        content,        
        prompt: undefined,
        role: Role.CLIENT,
        run_id: undefined,
        phone_number: phoneNumber,
        manager_phone_number: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}



export function useSendMessage(phoneNumber: string | null, sessionId: string | null) {

    // const { phoneNumber } = useSelectedPhoneNumber()
    const { mutate, data: messages, isLoading } = useInfiniteChat(phoneNumber, sessionId)
    // const sending = usePlayGroundStore(state => state.sending)
    // const setSending = usePlayGroundStore(state => state.setSending)
    // const messages = usePlayGroundStore(state => state.messages)

    // const { trigger, isMutating } = useMutation(`/api/debug/chat`, {
    //     method: "POST",
    //     onSuccess: (data: IMessage[]) => {
    //         console.log("Sent message")
    //     },
    //     onError: (error) => {
    //         console.error(error)
    //     }
    // })


    // return {
    //     isSending: isMutating,
    //     sendMessage: (content: EditorValue) => {
    //         if (!content) {
    //             throw new Error("Message content is empty.");
    //         }
    //         if (!phoneNumber) {
    //             throw new Error("Phone number is empty.");
    //         }
    //         trigger({ phoneNumber, content: content.text })
    //     }
    // }

    const sendMessageRequest = async (content: string, data: IMessage[], fromMessageId?: string | null, sessionId?: string | null, files?: any) => {
        console.log("################ content", content)
        if (!content) {
            throw new Error("Message content is empty.");

        }
        // const res = await fetch(`/api/chat`, {
        //     method: "POST",
        //     body: JSON.stringify({ content, fromMessageId, sessionId }),
        //     // body: { content: content },
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        const formData = new FormData();
        formData.append("content", content);
        if (fromMessageId)
            formData.append("fromMessageId", fromMessageId);
        if (sessionId)
            formData.append("sessionId", sessionId);
        if (files) {
            formData.append('file', files); // Append the file only if it exists
        }
        const res = await fetch(`/api/debug/${phoneNumber}/chat`, {
            method: "POST",
            body: formData,
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


    const sendMessage = useCallback(async (content: EditorValue, fromMessageId?: string | null, sessionid?: string | null, files?: any) => {
        try {
            if (!phoneNumber) {
                return //TODO understand how to generalize this.
            }
            // setSending(true)
            console.log("#### curr", messages)
            const oldData = [...messages]
            // const optimisticData = [optimisticMessage(content.text, phoneNumber), ...(fromMessageId ? filterMessagesFromId(oldData, fromMessageId) : oldData)]
            const optimisticData = fromMessageId ? filterMessagesFromId(oldData, fromMessageId) : [optimisticMessage(content.text, phoneNumber), ...oldData]
            await mutate(sendMessageRequest(content.text, oldData, fromMessageId, sessionid, files), {
                optimisticData: optimisticData,
            });
            // setSending(false)
        } catch (error) {
            console.error(error)
            // setSending(false)
        }
    }, [messages, phoneNumber])


    return {
        // isSending: sending,
        isSending: isLoading,
        sendMessage
    }
}

export function useResendMessage() {

}


export function useDeleteMessage(phoneNumber: string | null, sessionId: string | null) {

    // const setMessages = usePlayGroundStore(state => state.setMessages)
    // const { phoneNumber } = useSelectedPhoneNumber()
    const { mutate, data: messages } = useInfiniteChat(phoneNumber, sessionId)
    // const setSending = usePlayGroundStore(state => state.setSending)
    // const messages= usePlayGroundStore(state => state.messages)

    const deleteMessageRequest = async (messageId: string, data: IMessage[]) => {
        const res = await fetch(`/api/debug/chat`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({messageId, phoneNumber})
        })
        if (res.ok) {
            return data.filter((msg: IMessage) => msg.id !== messageId)
        } else {
            throw new Error("Failed to delete message.");
        }
    }


    const deleteMessage = useCallback(async (id: string) => {
        try {
            if (!phoneNumber) {
                return
            }
            // setSending(true)
            const oldData = [...messages]
            await mutate(deleteMessageRequest(id, oldData), {
                optimisticData: oldData.filter((msg: IMessage) => msg.id !== id),
            });
            // setSending(false)
        } catch (error) {
            console.error(error)
            // setSending(false)
        }
    }, [messages, phoneNumber])

    return {
        deleteMessage: deleteMessage
    }
}


export function useChatSendMessage(phoneNumber: string | null) {
    // const { } = useMutation("/")
}

