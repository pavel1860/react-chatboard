import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBotState, useStore } from "../../store/useStore";
// import Layout from "@/components/Layout";
// import { LayoutPane, LayoutContent, SplitLayout } from "react-chatboard/src/components/layout/layout";
import { createContext, useContext, useEffect, useState } from "react";
import { Button, cn } from "@heroui/react";
import { useRouter } from "next/router";
import { Icon } from "@iconify-icon/react";
import { useChat } from "../../providers/chat-provider";
import ChatBlockView from "../../components/chat/ChatBlockView";
import { ChatInput } from "../../components/editor/input";
import { useConversationRouter } from "../../hooks/conversation-hook";
import { motion, AnimatePresence } from "framer-motion";
// import { useBotState } from "../../hooks/use-bot-state";
import AdminChatView from "../../components/chat/AdminChatView";
import { AdminNavigationBar } from "./adminNavBar";
import { useWindowSize } from "../../components/layout/screenUtils";
import { DebugPannel } from "../../components/chat/debug";
function useIsLargeScreen() {
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };
        // Check initially
        checkScreenSize();
        // Add event listener
        window.addEventListener("resize", checkScreenSize);
        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);
    return isLargeScreen;
}
export const LayoutHeader = ({ children, href, startContent, endContent, onClick, className, size = "md" }) => {
    const router = useRouter();
    const { setIsArtifactViewOpen } = useConversationRouter();
    return (_jsxs("div", { className: cn("flex flex-row items-center gap-2 w-full px-4 xl:px-16 my-[calc(12px-0.5px)]", {
            "h-[40px]": size === "sm",
            "h-[50px]": size === "md",
            "h-[60px]": size === "lg",
        }), children: [startContent && (_jsx("div", { className: "flex flex-row items-center gap-2", children: startContent })), _jsxs("div", { className: "flex-grow flex justify-end gap-2", children: [_jsx("button", { onClick: () => {
                            console.log("onClick", href, onClick);
                            href && router.push(href);
                            if (onClick) {
                                onClick();
                            }
                            else {
                                setIsArtifactViewOpen(true);
                            }
                        }, className: cn("px-4 py-2 rounded-md flex justify-center sm:justify-end", className), children: children }), endContent && (_jsx("div", { className: "flex flex-row items-center gap-2", children: endContent }))] })] }));
};
const LayoutContext = createContext(undefined);
export const LayoutProvider = ({ children, isArtifactViewOpen: controlledIsArtifactViewOpen, setIsArtifactViewOpen: setControlledIsArtifactViewOpen }) => {
    const [isArtifactViewOpen, setIsArtifactViewOpen] = useState(controlledIsArtifactViewOpen);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDebugMode, setIsDebugMode] = useState(false);
    useEffect(() => {
        setIsArtifactViewOpen(controlledIsArtifactViewOpen);
    }, [controlledIsArtifactViewOpen]);
    return (_jsx(LayoutContext.Provider, { value: {
            isArtifactViewOpen,
            setIsArtifactViewOpen: (open) => {
                setIsArtifactViewOpen(open);
                setControlledIsArtifactViewOpen && setControlledIsArtifactViewOpen(open);
            },
            isSidebarOpen,
            setIsSidebarOpen: (open) => {
                setIsSidebarOpen(open);
            },
            isDebugMode,
            setIsDebugMode: (debug) => {
                setIsDebugMode(debug);
            }
        }, children: children }));
};
export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("use Layout must be used within a LayoutProvider");
    }
    return context;
}
const DebugButton = () => {
    const { isDebugMode, setIsDebugMode } = useLayout();
    return (_jsx(Button, { variant: "light", onPress: () => setIsDebugMode && setIsDebugMode(!isDebugMode), isIconOnly: true, startContent: _jsx(Icon, { icon: "solar:bug-linear", height: 20, width: 20 }) }));
};
const TestButton = () => {
    return (_jsx(Button, { variant: "light", href: "/tests", isIconOnly: true, startContent: _jsx(Icon, { icon: "solar:test-tube-linear", height: 20, width: 20 }) }));
};
const CHAT_VIEW_WIDTH = 38.5;
// #################### actual #####################
export function DesktopLayout({ sidebar, header, chatView, inputView, children, rightSidebar, extra }) {
    const { isArtifactViewOpen, setIsArtifactViewOpen, isSidebarOpen, setIsSidebarOpen, isDebugMode, setIsDebugMode } = useLayout();
    return (_jsxs("div", { className: "h-screen flex flex-col scrollbar-hide", children: [extra, _jsxs("main", { className: "flex flex-1 w-full overflow-hidden", children: [sidebar && _jsx(SideLayoutDrawer, { isOpen: isSidebarOpen, className: "w-[400px]", direction: "left-right", closePosition: "top-right", openPosition: "top-left", closeComponent: setIsSidebarOpen && _jsx(IconButton, { icon: "solar:siderbar-linear", hoverIcon: "solar:arrow-left-line-duotone", onClick: () => setIsSidebarOpen(false) }), openComponent: setIsSidebarOpen && _jsx(IconButton, { icon: "solar:siderbar-linear", hoverIcon: "solar:arrow-right-line-duotone", onClick: () => setIsSidebarOpen(true) }), children: sidebar }), _jsxs("div", { className: cn("flex flex-col items-center transition-all duration-300", isArtifactViewOpen ? "w-1/2" : "w-full"), children: [header && _jsxs("div", { className: "w-full flex justify-end", children: [header, " ", _jsx(DebugButton, {}), " ", _jsx(TestButton, {})] }), _jsx(LayoutPane, { children: chatView }), _jsx(LayoutFooter, { className: "pt-0", children: inputView })] }), isDebugMode && _jsx(DebugPannel, {}), _jsx(LayoutDrawer, { direction: "right-left", className: "w-1/2 h-full border-l border-default-200", closeComponent: setIsArtifactViewOpen && _jsx(DesktopHandle, { setIsArtifactViewOpen: setIsArtifactViewOpen }), closePosition: "left", children: _jsx(LayoutPane, { children: children }) }), rightSidebar && _jsx("aside", { className: "h-full border-l border-default-200", children: rightSidebar })] })] }));
}
export function MobileLayout({ header, chatView, inputView, children, rightSidebar, sidebar, extra }) {
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useLayout();
    // useEffect(() => {
    //     const setVh = () => {
    //       document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    //     };
    //     setVh();
    //     window.addEventListener('resize', setVh);
    //     return () => window.removeEventListener('resize', setVh);
    // }, []);
    const { size, bodyDiff } = useWindowSize();
    return (_jsxs("div", { 
        // className="mobile-full-height flex flex-col overflow-hidden scrollbar-hide"
        className: "min-h-[100dvh] flex flex-col overflow-hidden scrollbar-hide", children: [extra, _jsxs("main", { className: "flex-1 w-full flex flex-col relative overflow-hidden", children: [_jsx(LayoutDrawer, { minimized: header, closePosition: "bottom", closeComponent: setIsArtifactViewOpen && _jsx(LayoutHandle, { setIsArtifactViewOpen: setIsArtifactViewOpen }), className: "inset-0  z-40", children: _jsx(LayoutPane, { children: children }) }), sidebar && _jsx("aside", { className: "hidden h-full border-l border-default-200", children: sidebar }), _jsx(LayoutDrawer, { inverse: true, direction: "bottom-up", className: "inset-0 z-30", children: _jsx(LayoutPane, { children: chatView }) })] }), _jsx(LayoutFooter, { className: "z-50 pt-0 px-1", children: inputView })] }));
}
export function Layout(props) {
    const isLargeScreen = useIsLargeScreen();
    return (_jsx(LayoutProvider, { isArtifactViewOpen: props.isArtifactViewOpen, setIsArtifactViewOpen: props.setIsArtifactViewOpen, children: isLargeScreen ? _jsx(DesktopLayout, { ...props }) : _jsx(MobileLayout, { ...props }) }));
}
export function LayoutPane({ children, className, maxContentWidth }) {
    const { bodyDiff } = useWindowSize();
    return _jsx("div", { className: cn("flex flex-col flex-1 w-full flex-grow overflow-hidden", maxContentWidth && `max-w-${maxContentWidth}`, className), children: children });
}
export function LayoutFooter({ children, className }) {
    return _jsx("footer", { className: cn("flex flex-col items-center justify-start gap-2 w-full px-2 py-2", className), children: children });
}
export const LayoutHandle = ({ setIsArtifactViewOpen }) => (_jsx("div", { className: "handle rounded-t-md border-t border-x border-default-300 bg-default-100", children: _jsx(Button, { variant: "light", onPress: () => setIsArtifactViewOpen(false), startContent: _jsx(Icon, { icon: "solar:chat-round-dots-linear", height: 20, width: 20 }), children: "Chat View" }) }));
export const DesktopHandle = ({ setIsArtifactViewOpen }) => (_jsx("button", { onClick: () => setIsArtifactViewOpen(false), className: "w-4 h-14 overflow-hidden hover:bg-default-100 rounded-r-md flex flex-col justify-center z-50 bg-white ", children: _jsx(Icon, { icon: "solar:alt-arrow-right-linear", height: 20, width: 20, className: "text-default-500" }) })
// </div>
);
export const IconButton = ({ icon, onClick, hoverIcon }) => {
    const [isHovered, setIsHovered] = useState(false);
    let actualIcon = icon;
    if (hoverIcon) {
        actualIcon = isHovered ? hoverIcon : icon;
    }
    return (_jsx(Button, { variant: "light", isIconOnly: true, onPress: () => onClick(), startContent: _jsx(Icon, { icon: actualIcon, height: 20, width: 20, className: "text-default-500" }), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false) }));
};
const getAnimationParams = (direction) => {
    switch (direction) {
        case "top-down": return { initial: { y: "-100%" }, animate: { y: "0%" }, exit: { y: "-100%" } };
        case "bottom-up": return { initial: { y: "100%" }, animate: { y: "0%" }, exit: { y: "100%" } };
        case "left-right": return { initial: { x: "-100%" }, animate: { x: "0%" }, exit: { x: "-100%" } };
        case "right-left": return { initial: { x: "100%" }, animate: { x: "0%" }, exit: { x: "100%" } };
    }
};
const getClosePosition = (closePosition) => {
    switch (closePosition) {
        case "top-left": return "top-0 left-0";
        case "top-right": return "top-0 right-0";
        case "bottom-left": return "bottom-0 left-0";
        case "bottom-right": return "bottom-0 right-0";
        case "top": return "top-0 left-1/2 -translate-x-1/2";
        case "bottom": return "bottom-0 left-1/2 -translate-x-1/2";
        case "left": return "left-0 top-1/2 -translate-y-1/2";
        case "right": return "right-0 top-1/2 -translate-y-1/2";
        default: return "bottom-0 right-0";
    }
};
export function LayoutDrawer({ children, className, minimized, direction = "top-down", closeComponent, closePosition = "bottom-right", inverse = false }) {
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useLayout();
    const isOpen = inverse ? !isArtifactViewOpen : isArtifactViewOpen;
    return (_jsxs(AnimatePresence, { initial: false, children: [minimized && !isOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: _jsx("div", { className: "", children: minimized }) }, "header")), isOpen && (_jsxs(motion.div, { ...getAnimationParams(direction), transition: { duration: 0.3 }, className: cn("flex-grow relative flex flex-col items-center overflow-hidden", className), children: [children, closeComponent && (_jsx("div", { className: cn("flex flex-row items-end justify-end absolute z-50", getClosePosition(closePosition)), children: closeComponent }))] }, "artifact"))] }));
}
export function SideLayoutDrawer({ children, className, isOpen, direction = "top-down", closeComponent, openComponent, openPosition = "top-left", closePosition = "bottom-right", inverse = false, duration = 0.1 }) {
    return (_jsx(AnimatePresence, { initial: false, children: isOpen ? (_jsxs(motion.aside, { ...getAnimationParams(direction), transition: { duration: duration }, className: cn("flex-grow relative flex flex-col items-center overflow-hidden", className), children: [children, closeComponent && (_jsx("div", { className: cn("flex flex-row items-end justify-end absolute z-50", getClosePosition(closePosition)), children: closeComponent }))] }, "artifact")) :
            openComponent && (_jsx("div", { className: cn("flex flex-row items-end justify-end absolute z-50 absolute left-0", getClosePosition(openPosition)), children: openComponent })) }));
}
export function ConversationLayout({ header, children, hideFooter = false, chatView, inputView, sidebar, extra }) {
    const { sendMessage } = useChat();
    const state = useBotState();
    const isLargeScreen = useIsLargeScreen();
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useStore();
    return (_jsx(Layout, { extra: extra, header: header, 
        // chatView={chatView || <ChatView />}
        chatView: chatView || _jsx(ChatBlockView, {}), sidebar: sidebar, rightSidebar: _jsx(AdminNavigationBar, { isVertical: true, hideLabels: true }), inputView: !hideFooter && (inputView || _jsx(ChatInput, { bgColor: "#F4F4F5", borderColor: "#E0E0E0", placeholder: "What are you looking for today?", minRows: isLargeScreen ? 2 : 1, maxRows: isLargeScreen ? 10 : 5, onSubmit: (text) => sendMessage(text, undefined, state) })), isArtifactViewOpen: isArtifactViewOpen, setIsArtifactViewOpen: setIsArtifactViewOpen, children: children }));
}
export function AdminConversationLayout({ header, children, chatView, inputView, hideFooter = false, sidebar, extra }) {
    const { sendMessage } = useChat();
    const state = useBotState();
    const isLargeScreen = useIsLargeScreen();
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useStore();
    return (_jsx(Layout, { extra: extra, header: header, chatView: chatView || _jsx(AdminChatView, {}), sidebar: sidebar, rightSidebar: _jsx(AdminNavigationBar, { isVertical: true, hideLabels: true }), inputView: !hideFooter && (inputView || _jsx(ChatInput, { bgColor: "#F4F4F5", borderColor: "#E0E0E0", showRole: true, isUserDanger: true, defaultRole: "user", saveHistory: true, placeholder: "What are you looking for today?", 
            // onKeyPress={sendMessage}
            onSubmit: (text, role) => {
                sendMessage(text, undefined, state, undefined, undefined, undefined, role);
            } })), isArtifactViewOpen: isArtifactViewOpen, setIsArtifactViewOpen: setIsArtifactViewOpen, children: children }));
}
//# sourceMappingURL=conversationLayout.js.map