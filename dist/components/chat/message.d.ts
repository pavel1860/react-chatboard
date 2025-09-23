import { MessageType, ChoiceType } from "../../services/turnService";
interface MessageProps {
    message: MessageType;
    avatar?: string | null;
    index: number;
    showChoices?: boolean;
    isStreaming?: boolean;
    onChoice?: (choice: ChoiceType) => void;
}
export declare const Message: ({ message, index, showChoices, onChoice, avatar, isStreaming, }: MessageProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=message.d.ts.map