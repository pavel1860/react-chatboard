type Width = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "10xl" | "full" | "auto" | "fit";
export interface ChatInputProps {
    placeholder: string | undefined;
    width?: Width;
    maxWidth?: Width;
    rows?: number;
    showRole?: boolean;
    isUserDanger?: boolean;
    defaultRole?: string;
    removeFile?: () => void;
    onSubmit: (text: string, role: string) => void;
    dontClear?: boolean;
    bgColor?: string;
    borderColor?: string;
    loading?: boolean;
    textSize?: "sm" | "md" | "lg";
    minRows?: number;
    maxRows?: number;
    saveHistory?: boolean;
    historyLength?: number;
}
export declare function ChatInput({ placeholder, onSubmit, dontClear, bgColor, borderColor, rows, minRows, maxRows, width, maxWidth, showRole, defaultRole, isUserDanger, loading, textSize, historyLength, saveHistory, }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=input.d.ts.map