import { TurnType } from "../services/turnService";
import { ToolCall } from "../components/chat/schema";
export interface ChatContextType {
    turns: TurnType[];
    fetchMore: () => void;
    loading: boolean;
    error: Error | null;
    sending: boolean;
    sendMessage: (content: string, toolCalls?: ToolCall[], state?: any, fromTurnId?: number | null, addBranch?: boolean, files?: any, role?: string) => Promise<void>;
    mutate: () => void;
}
export interface ChatOptions {
    completeUrl: string;
}
declare function ChatProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare const useChat: () => ChatContextType;
export { ChatProvider, useChat, };
//# sourceMappingURL=chat-provider.d.ts.map