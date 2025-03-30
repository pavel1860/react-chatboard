import { create} from 'zustand';
import { devtools } from 'zustand/middleware';
import { IMessage } from '../services/types';




export type ChatStore = {
    messages: IMessage[]
    loading: boolean
    error: any
    limit: number
    sending: boolean
    setMessages: (messages: IMessage[]) => void
}


//@ts-ignore
export const createChatSlice = (set, get): ChatStore => ({
    messages: [],
    loading: false,
    error: null,
    limit: 10,
    sending: false,
    setMessages: (messages: IMessage[]) => {
        set({messages})
    }
})