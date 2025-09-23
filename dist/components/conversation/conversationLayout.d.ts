import { ReactNode } from "react";
type HandlePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom" | "left" | "right";
interface LayoutHeaderProps {
    children: React.ReactNode;
    className?: string;
    navigation?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
}
export declare const LayoutHeader: ({ children, href, startContent, endContent, onClick, className, size }: LayoutHeaderProps) => import("react/jsx-runtime").JSX.Element;
interface LayoutContextType {
    isArtifactViewOpen?: boolean;
    setIsArtifactViewOpen?: (open: boolean) => void;
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (open: boolean) => void;
    isDebugMode?: boolean;
    setIsDebugMode?: (debug: boolean) => void;
}
interface LayoutProviderProps {
    children: ReactNode;
    isArtifactViewOpen?: boolean;
    setIsArtifactViewOpen?: (open: boolean) => void;
}
export declare const LayoutProvider: ({ children, isArtifactViewOpen: controlledIsArtifactViewOpen, setIsArtifactViewOpen: setControlledIsArtifactViewOpen }: LayoutProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare function useLayout(): LayoutContextType;
export declare function DesktopLayout({ sidebar, header, chatView, inputView, children, rightSidebar, extra }: ConversationLayoutProps): import("react/jsx-runtime").JSX.Element;
export declare function MobileLayout({ header, chatView, inputView, children, rightSidebar, sidebar, extra }: ConversationLayoutProps): import("react/jsx-runtime").JSX.Element;
export declare function Layout(props: ConversationLayoutProps): import("react/jsx-runtime").JSX.Element;
export declare function LayoutPane({ children, className, maxContentWidth }: {
    children?: React.ReactNode;
    className?: string;
    maxContentWidth?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function LayoutFooter({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare const LayoutHandle: ({ setIsArtifactViewOpen }: {
    setIsArtifactViewOpen: (open: boolean) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DesktopHandle: ({ setIsArtifactViewOpen }: {
    setIsArtifactViewOpen: (open: boolean) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const IconButton: ({ icon, onClick, hoverIcon }: {
    icon: string;
    hoverIcon?: string;
    onClick: () => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare function LayoutDrawer({ children, className, minimized, direction, closeComponent, closePosition, inverse }: {
    children?: React.ReactNode;
    className?: string;
    minimized?: React.ReactNode;
    direction?: "top-down" | "bottom-up" | "left-right" | "right-left";
    closeComponent?: React.ReactNode;
    closePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom" | "left" | "right";
    inverse?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function SideLayoutDrawer({ children, className, isOpen, direction, closeComponent, openComponent, openPosition, closePosition, inverse, duration }: {
    children?: React.ReactNode;
    className?: string;
    isOpen?: boolean;
    direction?: "top-down" | "bottom-up" | "left-right" | "right-left";
    duration?: number;
    closeComponent?: React.ReactNode;
    openComponent?: React.ReactNode;
    closePosition?: HandlePosition;
    openPosition?: HandlePosition;
    inverse?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export interface ConversationLayoutProps {
    children?: React.ReactNode;
    extra?: React.ReactNode;
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    chatView?: React.ReactNode;
    inputView?: React.ReactNode;
    rightSidebar?: React.ReactNode;
    branchId?: number;
    chatLoading?: boolean;
    artifactLoading?: boolean;
    isArtifactViewOpen?: boolean;
    setIsArtifactViewOpen?: (open: boolean) => void;
    hideFooter?: boolean;
}
export declare function ConversationLayout({ header, children, hideFooter, chatView, inputView, sidebar, extra }: ConversationLayoutProps): import("react/jsx-runtime").JSX.Element;
export declare function AdminConversationLayout({ header, children, chatView, inputView, hideFooter, sidebar, extra }: ConversationLayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=conversationLayout.d.ts.map