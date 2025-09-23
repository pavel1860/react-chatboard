import { EditorValue } from "../components/editor/util";
import { IMessage } from "../services/chatbot-service";
interface ChatState {
    messages: IMessage[];
    loading: boolean;
    error: any;
    sending: boolean;
    sendMessage: (content: EditorValue, fromMessageId?: string) => void;
    deleteMessage: (id: string) => void;
    refetch: () => void;
    setLimit: (limit: number) => void;
    setOffset: (offset: number) => void;
    fetchMore: () => void;
}
export declare const useChatBot: (selectedPhoneNumber: string) => ChatState;
export {};
//# sourceMappingURL=chatbot-hook.d.ts.map