import { IMessage } from '../../services/types';




export type ChatStore = {
    messages: IMessage[]
    loading: boolean
    error: any
    limit: number
    sending: boolean
    setSending: (sending: boolean) => void
    setMessages: (messages: IMessage[]) => void
}


//@ts-ignore
export const createChatSlice = (set, get): ChatStore => ({
    messages: [],
    loading: false,
    error: null,
    limit: 10,
    sending: false,
    setSending: (sending: boolean) => {
        set({sending}, undefined, "setSending")
    },
    setMessages: (messages: IMessage[]) => {
        return set({messages}, undefined, "setMessages")
    },
})
