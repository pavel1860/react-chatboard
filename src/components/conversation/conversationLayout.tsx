import { useBotState, useStore } from "../../store/useStore";
// import Layout from "@/components/Layout";
// import { LayoutPane, LayoutContent, SplitLayout } from "react-chatboard/src/components/layout/layout";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Button, cn, Divider } from "@heroui/react";
import { useRouter } from "next/router";

import { Icon } from "@iconify-icon/react";

import { useChat } from "../../providers/chat-provider";
import ChatView from "../../components/chat/ChatView";
import ChatBlockView from "../../components/chat/ChatBlockView";
import { ChatInput } from "../../components/editor/input";
import { useConversationRouter } from "../../hooks/conversation-hook";
import { motion, AnimatePresence } from "framer-motion";
// import { useBotState } from "../../hooks/use-bot-state";
import AdminChatView from "../../components/chat/AdminChatView";
import { AdminNavigationBar } from "./adminNavBar";
import { useWindowSize } from "../../components/layout/screenUtils";
import { DebugPannel } from "../../components/chat/debug";
import { useTestSelection } from "../evaluation/evaluators";




type HandlePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom" | "left" | "right"


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

interface LayoutHeaderProps {
    children: React.ReactNode
    className?: string
    navigation?: React.ReactNode
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    href?: string,
    onClick?: () => void
    size?: "sm" | "md" | "lg"
}

export const LayoutHeader = ({ children, href, startContent, endContent, onClick, className, size = "md" }: LayoutHeaderProps) => {
    const router = useRouter();
    const { setIsArtifactViewOpen } = useConversationRouter()

    return (
        <div
            className={cn("flex flex-row items-center gap-2 w-full px-4 xl:px-16 my-[calc(12px-0.5px)]", {
                "h-[40px]": size === "sm",
                "h-[50px]": size === "md",
                "h-[60px]": size === "lg",
            })}
        >
            {startContent && (
                <div className="flex flex-row items-center gap-2">{startContent}</div>
            )}
            <div className="flex-grow flex justify-end gap-2">
            <button
                onClick={() => {
                    console.log("onClick", href, onClick);
                    href && router.push(href);
                    if (onClick) {
                        onClick();
                    } else {
                        setIsArtifactViewOpen(true);
                    }
                }}
                className={cn(
                    "px-4 py-2 rounded-md flex justify-center sm:justify-end",
                    className
                )}
            >
                {children}
            </button>
            {endContent && (
                <div className="flex flex-row items-center gap-2">{endContent}</div>
            )}
            </div>
        </div>
    );
}






interface LayoutContextType {
    isArtifactViewOpen?: boolean;
    setIsArtifactViewOpen?: (open: boolean) => void;
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (open: boolean) => void;
    isDebugMode?: boolean;
    setIsDebugMode?: (debug: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);


interface LayoutProviderProps {
    children: ReactNode;
    isArtifactViewOpen?: boolean;
    setIsArtifactViewOpen?: (open: boolean) => void;
}


export const LayoutProvider = ({ children, isArtifactViewOpen: controlledIsArtifactViewOpen, setIsArtifactViewOpen: setControlledIsArtifactViewOpen }: LayoutProviderProps) => {
    const [isArtifactViewOpen, setIsArtifactViewOpen] = useState(controlledIsArtifactViewOpen);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDebugMode, setIsDebugMode] = useState(false);

    useEffect(() => {
        setIsArtifactViewOpen(controlledIsArtifactViewOpen);
    }, [controlledIsArtifactViewOpen]);

    return (
        <LayoutContext.Provider value={{
            isArtifactViewOpen,
            setIsArtifactViewOpen: (open: boolean) => {
                setIsArtifactViewOpen(open);
                setControlledIsArtifactViewOpen && setControlledIsArtifactViewOpen(open)
            },
            isSidebarOpen,
            setIsSidebarOpen: (open: boolean) => {
                setIsSidebarOpen(open);
            },
            isDebugMode,
            setIsDebugMode: (debug: boolean) => {
                setIsDebugMode(debug);
            }
        }}>
            {children}
        </LayoutContext.Provider>
    );
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
    return (
        <Button 
            variant="light" 
            onPress={() => setIsDebugMode && setIsDebugMode(!isDebugMode)}
            isIconOnly
            startContent={<Icon icon="solar:bug-linear" height={20} width={20} />}
        />
         
    )
}


const TestButton = () => {
    
    return (
        <Button 
            variant="light" 
            href="/tests"
            isIconOnly
            startContent={<Icon icon="solar:test-tube-linear" height={20} width={20} />}
        />
    )
}


const CHAT_VIEW_WIDTH = 38.5;

// #################### actual #####################
export function DesktopLayout({ sidebar, header, chatView, inputView, children, rightSidebar, extra }: ConversationLayoutProps) {
    const { 
        isArtifactViewOpen, 
        setIsArtifactViewOpen, 
        isSidebarOpen, 
        setIsSidebarOpen,
        isDebugMode,
        setIsDebugMode
    } = useLayout();

    return (
        <div className="h-screen flex flex-col scrollbar-hide">
            {extra}
                <main className="flex flex-1 w-full overflow-hidden">
                {/* {sidebar && <aside className="h-full border-r border-default-200">
                    {sidebar}
                </aside>} */}
                {sidebar && <SideLayoutDrawer 
                    isOpen={isSidebarOpen} 
                    className="w-[400px]"
                    direction="left-right" 
                    closePosition="top-right"
                    openPosition="top-left"
                    closeComponent={setIsSidebarOpen && <IconButton icon="solar:siderbar-linear" hoverIcon="solar:arrow-left-line-duotone" onClick={() => setIsSidebarOpen(false)} />}                        
                    openComponent={setIsSidebarOpen && <IconButton icon="solar:siderbar-linear" hoverIcon="solar:arrow-right-line-duotone" onClick={() => setIsSidebarOpen(true)} />}
                    >
                    {sidebar}
                </SideLayoutDrawer>}
                {/* Left chat panel */}
                <div className={cn("flex flex-col items-center transition-all duration-300", isArtifactViewOpen ? "w-1/2" : "w-full")}>
                    {header && <div className="w-full flex justify-end">{header} <DebugButton /> <TestButton /></div>}
                    <LayoutPane>{chatView}</LayoutPane>
                    <LayoutFooter className="pt-0">{inputView}</LayoutFooter>
                </div>
                {isDebugMode && <DebugPannel />}

                {/* Right side drawer using LayoutDrawer */}
                <LayoutDrawer
                    direction="right-left"
                    className="w-1/2 h-full border-l border-default-200"
                    closeComponent={setIsArtifactViewOpen && <DesktopHandle setIsArtifactViewOpen={setIsArtifactViewOpen} />}
                    closePosition="left"
                >
                    <LayoutPane>{children}</LayoutPane>
                </LayoutDrawer>
                {rightSidebar && <aside className="h-full border-l border-default-200">
                    {rightSidebar}
                </aside>}
            </main>
        </div>
    );
}

export function MobileLayout({ header, chatView, inputView, children, rightSidebar, sidebar, extra }: ConversationLayoutProps) {
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useLayout();


    // useEffect(() => {
    //     const setVh = () => {
    //       document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    //     };
    //     setVh();
    //     window.addEventListener('resize', setVh);
    //     return () => window.removeEventListener('resize', setVh);
    // }, []);
    const {size, bodyDiff} =useWindowSize()

    return (
        <div 
            // className="mobile-full-height flex flex-col overflow-hidden scrollbar-hide"
            className="min-h-[100dvh] flex flex-col overflow-hidden scrollbar-hide"
        >        
            {extra}
            <main className="flex-1 w-full flex flex-col relative overflow-hidden">
                <LayoutDrawer
                    minimized={header}
                    closePosition="bottom"
                    closeComponent={setIsArtifactViewOpen && <LayoutHandle setIsArtifactViewOpen={setIsArtifactViewOpen} />}
                    className="inset-0  z-40"
                >
                    <LayoutPane>{children}</LayoutPane>
                </LayoutDrawer>
                {sidebar && <aside className="hidden h-full border-l border-default-200">
                    {sidebar}
                </aside>}
                <LayoutDrawer
                    inverse
                    direction="bottom-up"
                    className="inset-0 z-30"
                >
                    <LayoutPane>{chatView}</LayoutPane>
                </LayoutDrawer>
            </main>
            <LayoutFooter className="z-50 pt-0 px-1">{inputView}</LayoutFooter>
        </div>
    );
}


export function Layout(props: ConversationLayoutProps) {
    const isLargeScreen = useIsLargeScreen();

    return (
        <LayoutProvider isArtifactViewOpen={props.isArtifactViewOpen} setIsArtifactViewOpen={props.setIsArtifactViewOpen}>
            {isLargeScreen ? <DesktopLayout {...props} /> : <MobileLayout {...props} />}
        </LayoutProvider>
    )
}





export function LayoutPane({ children, className, maxContentWidth }: {
    children?: React.ReactNode,
    className?: string,
    maxContentWidth?: string
}) {

    const {bodyDiff} = useWindowSize()
    return <div
        className={cn(
            "flex flex-col flex-1 w-full flex-grow overflow-hidden",
            maxContentWidth && `max-w-${maxContentWidth}`,
            className)
        }
    >
        {children}
    </div>;
}



export function LayoutFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return <footer className={cn("flex flex-col items-center justify-start gap-2 w-full px-2 py-2", className)}>{children}</footer>;
}


export const LayoutHandle = ({ setIsArtifactViewOpen }: { setIsArtifactViewOpen: (open: boolean) => void }) => (
    <div className="handle rounded-t-md border-t border-x border-default-300 bg-default-100">
        <Button variant="light" onPress={() => setIsArtifactViewOpen(false)} startContent={<Icon icon="solar:chat-round-dots-linear" height={20} width={20} />}>
            {/* <Icon icon="solar:chat-round-dots-linear" height={20} width={20} /> */}
            Chat View
        </Button>
    </div>
);


export const DesktopHandle = ({ setIsArtifactViewOpen }: { setIsArtifactViewOpen: (open: boolean) => void }) => (
    <button
        onClick={() => setIsArtifactViewOpen(false)}
        className="w-4 h-14 overflow-hidden hover:bg-default-100 rounded-r-md flex flex-col justify-center z-50 bg-white "
    // startContent={}
    ><Icon icon="solar:alt-arrow-right-linear" height={20} width={20} className="text-default-500" /></button>
    // </div>
)


export const IconButton = ({ icon, onClick, hoverIcon }: { icon: string, hoverIcon?: string, onClick: () => void }) => {

    const [isHovered, setIsHovered] = useState(false);

    let actualIcon = icon;
    if (hoverIcon) {
        actualIcon = isHovered ? hoverIcon : icon;
    }

    return (
        <Button 
            variant="light" 
            isIconOnly
            onPress={() => onClick()} 
            startContent={<Icon icon={actualIcon} height={20} width={20} className="text-default-500" />} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        />
    )
}


const getAnimationParams = (direction: "top-down" | "bottom-up" | "left-right" | "right-left") => {
    switch (direction) {
        case "top-down": return { initial: { y: "-100%" }, animate: { y: "0%" }, exit: { y: "-100%" } };
        case "bottom-up": return { initial: { y: "100%" }, animate: { y: "0%" }, exit: { y: "100%" } };
        case "left-right": return { initial: { x: "-100%" }, animate: { x: "0%" }, exit: { x: "-100%" } };
        case "right-left": return { initial: { x: "100%" }, animate: { x: "0%" }, exit: { x: "100%" } };
    }
};



const getClosePosition = (closePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom" | "left" | "right") => {
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
}

export function LayoutDrawer({ children, className, minimized, direction = "top-down", closeComponent, closePosition = "bottom-right", inverse = false }: {
    children?: React.ReactNode,
    className?: string,
    minimized?: React.ReactNode,
    direction?: "top-down" | "bottom-up" | "left-right" | "right-left",
    closeComponent?: React.ReactNode,
    closePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom" | "left" | "right",
    inverse?: boolean

}) {
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useLayout();

    const isOpen = inverse ? !isArtifactViewOpen : isArtifactViewOpen;
    return (
        <AnimatePresence initial={false}>
            {minimized && !isOpen && (
                <motion.div
                    key="header"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="">{minimized}</div>
                </motion.div>
            )}
            {isOpen && (
                <motion.div
                    key="artifact"
                    {...getAnimationParams(direction)}
                    transition={{ duration: 0.3 }}
                    className={cn("flex-grow relative flex flex-col items-center overflow-hidden", className)}
                >
                    {children}
                    {closeComponent && (
                        <div
                            className={cn("flex flex-row items-end justify-end absolute z-50", getClosePosition(closePosition))}
                        >
                            {closeComponent}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}




export function SideLayoutDrawer({ 
    children, 
    className,
    isOpen, 
    direction = "top-down", 
    closeComponent, 
    openComponent, 
    openPosition = "top-left", 
    closePosition = "bottom-right", 
    inverse = false,
    duration = 0.1
}: {
    children?: React.ReactNode,
    className?: string,
    isOpen?: boolean
    direction?: "top-down" | "bottom-up" | "left-right" | "right-left",
    duration?: number,
    closeComponent?: React.ReactNode,
    openComponent?: React.ReactNode,
    closePosition?: HandlePosition,
    openPosition?: HandlePosition,
    inverse?: boolean    
}) {
    
    return (
        <AnimatePresence initial={false}>            
            {isOpen ? (
                <motion.aside
                    key="artifact"
                    {...getAnimationParams(direction)}
                    transition={{ duration: duration }}
                    className={cn("flex-grow relative flex flex-col items-center overflow-hidden", className)}
                >
                    {children}
                    {closeComponent && (
                        <div
                            className={cn("flex flex-row items-end justify-end absolute z-50", getClosePosition(closePosition))}
                        >
                            {closeComponent}
                        </div>
                    )}
                </motion.aside>
            ):
            openComponent && (
                <div
                    className={cn("flex flex-row items-end justify-end absolute z-50 absolute left-0", getClosePosition(openPosition))}
                >
                    {openComponent}
                </div>
            )}
        </AnimatePresence>
    );
}


// File: components/layout/types.ts
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


export function ConversationLayout({ header, children, hideFooter = false, chatView, inputView, sidebar, extra }: ConversationLayoutProps) {
    const { sendMessage } = useChat();
    const state = useBotState();
    const isLargeScreen = useIsLargeScreen();
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useStore();


    return (
        <Layout
            extra={extra}
            header={header}
            // chatView={chatView || <ChatView />}
            chatView={chatView || <ChatBlockView />}
            sidebar={sidebar}
            rightSidebar={<AdminNavigationBar isVertical hideLabels />}
            inputView={
                !hideFooter && (inputView || <ChatInput
                    bgColor="#F4F4F5"
                    borderColor="#E0E0E0"
                    placeholder="What are you looking for today?"
                    minRows={isLargeScreen ? 2 : 1}
                    maxRows={isLargeScreen ? 10 : 5}
                    onSubmit={(text: string) => sendMessage(text, undefined, state)}
                />
                )}
            isArtifactViewOpen={isArtifactViewOpen}
            setIsArtifactViewOpen={setIsArtifactViewOpen}
        >
            {children}
        </Layout>
    );
}






export function AdminConversationLayout({ header, children, chatView, inputView, hideFooter = false, sidebar, extra }: ConversationLayoutProps) {
    const { sendMessage } = useChat();
    const state = useBotState();
    const isLargeScreen = useIsLargeScreen();
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useStore();


    return (
        <Layout
            extra={extra}
            header={header}
            chatView={chatView || <AdminChatView />}
            sidebar={sidebar}
            rightSidebar={<AdminNavigationBar isVertical hideLabels />}
            inputView={
                !hideFooter && (inputView || <ChatInput
                    bgColor="#F4F4F5"
                    borderColor="#E0E0E0"
                    showRole={true}
                    isUserDanger={true}
                    defaultRole="user"
                    saveHistory={true}
                    placeholder="What are you looking for today?"
                    // onKeyPress={sendMessage}
                    onSubmit={(text: string, role: string) => {
                        sendMessage(text, undefined, state, undefined, undefined, undefined, role)
                    }}
                />
                )}
            isArtifactViewOpen={isArtifactViewOpen}
            setIsArtifactViewOpen={setIsArtifactViewOpen}
        >
            {children}
        </Layout>
    );
}