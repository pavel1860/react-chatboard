import { IMessage } from '../../services/types';
export type ChatStore = {
    messages: IMessage[];
    loading: boolean;
    error: any;
    limit: number;
    sending: boolean;
    setSending: (sending: boolean) => void;
    setMessages: (messages: IMessage[]) => void;
};
export declare const createChatSlice: (set: any, get: any) => ChatStore;
//# sourceMappingURL=chat-slice.d.ts.map