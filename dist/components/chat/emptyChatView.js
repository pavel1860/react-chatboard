import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// import { ArtifactCtxType, MessageType, useChat } from "@/providers/chat-provider";
// import AvatarChoices from "./choices/avatarChoices";
// import { ToolCall } from "react-chatboard/src/chat/chat-context";
import { useEffect, useRef, useState } from "react";
import { cn } from "@heroui/react";
// import EmptyChatView from "@/components/chat/emptyChatView";
import { useCreateConversation } from "../../services/conversationService";
import { Link } from "@heroui/react";
import { ChatInput } from "../../components/editor/input";
import { useCallback } from "react";
import { useStore } from "../../store/useStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "../../providers/ctx-provider";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
const EmptyMessage = ({ texts }) => {
    return (_jsx("div", { className: "flex flex-col items-start justify-center bg-default-100 rounded-2xl py-2 px-4 shadow-sm", children: texts.map((text, index) => (_jsx("p", { className: "text-center", children: text }, index))) }));
};
function useWindowSize() {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        // Skip if `window` is not available (i.e. during SSR)
        if (typeof window === 'undefined')
            return;
        function updateSize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        updateSize(); // Set initial size on client
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}
export default function EmptyChatView({ backgroundImage, title, messages, companyName, hideTermsAndServices }) {
    const { setPendingMessage, setArtifactView } = useStore();
    const { trigger: createConversation } = useCreateConversation();
    const router = useRouter();
    const { branchId, setBranchId, setConversationId } = useCtx();
    const { onAuthOpenChange, isArtifactViewOpen, setIsArtifactViewOpen } = useStore();
    const [imageOffset, setImageOffset] = useState(0);
    const { data: session, status } = useSession({
        required: false,
    });
    const headingRef = useRef(null);
    const size = useWindowSize();
    useEffect(() => {
        if (headingRef.current) {
            const headingRect = headingRef.current.getBoundingClientRect();
            setImageOffset(headingRect.top);
        }
    }, [size]);
    const handleSignUp = () => {
        onAuthOpenChange(true);
    };
    const handleLogout = () => {
        signOut({ callbackUrl: window.location.href });
    };
    const isAuthenticated = status === "authenticated";
    const handleMarketplaceClick = () => {
        setArtifactView("buy-marketplace");
    };
    const createConversationAndSend = useCallback(async (name, avatar, pendingMessage) => {
        const conversation = await createConversation({
            name: name,
            avatar: avatar,
        });
        setPendingMessage({
            conversationId: conversation.id,
            branchId: branchId,
            message: pendingMessage,
        });
        setConversationId(conversation.id);
    }, []);
    return (_jsxs("div", { className: cn("flex flex-col justify-center items-center gap-10 w-full h-full relative"), children: [_jsx(AnimatePresence, { initial: false, mode: "wait", children: !isArtifactViewOpen && backgroundImage &&
                    _jsx(motion.div, { className: cn("absolute inset-0 w-full h-full", "bg-gradient-to-b from-[rgba(113,113,122,0.6)] to-white"), initial: { opacity: 1 }, animate: { opacity: isArtifactViewOpen ? 0 : 1 }, exit: { opacity: 0 }, transition: { duration: 1 }, children: _jsx(Image, { src: backgroundImage, alt: "Ziggi background", className: "object-cover", fill: true }) }) }), _jsxs("main", { className: "h-full w-full flex flex-col justify-center items-center gap-3 relative", children: [_jsx("div", { className: "flex flex-col items-center justify-center max-w-5xl mt-6", children: _jsx("h1", { ref: headingRef, 
                            // className="text-center text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-extrabold text-[#18181B] flex-grow"
                            className: "text-center", children: title?.map((text, index) => (_jsx("div", { className: "text-default-700 text-6xl sm:text-6xl lg:text-5xl xl:text-7xl 2xl:text-8xl font-bold", children: text }, index))) }) }), _jsx("div", {}), _jsx("div", { className: "flex flex-col items-start justify-center gap-2 w-full max-w-3xl z-10 p-2", children: messages?.map((message, index) => (_jsx(EmptyMessage, { texts: message }, index))) }), _jsx("div", { 
                        // className="flex md:flex-row item-center w-full justify-center 2xl:px-14 px-4 lg:mx-auto lg:w-[63%]"
                        className: "w-full flex justify-center px-2 max-w-3xl", children: _jsx(ChatInput, { bgColor: "#FAFAFA", borderColor: "#E0E0E0", 
                            // width={"100%"}
                            rows: 1, placeholder: "What are you looking for today?", 
                            // onKeyPress={sendMessage}
                            onSubmit: (text) => {
                                // sendMessage(editorState.text, undefined, state)
                                createConversationAndSend(text.slice(0, 100), null, {
                                    content: text,
                                    choices: null,
                                    role: "user",
                                    id: 1,
                                    branchId: 1,
                                    turnId: 1,
                                    toolCalls: [],
                                    runId: null,
                                });
                            } }) })] }), !hideTermsAndServices && (_jsx("footer", { className: "w-full bg-white z-50", children: _jsxs("p", { className: "text-xs lg:text-sm font-normal text-center text-[#27272A] 2xl:mt-4 lg:mt-4", children: ["By interacting with ", companyName, " you agree to the", " ", _jsx(Link, { href: "/terms-of-use", className: "text-primary text-xs lg:text-sm hover:underline", children: "Terms of Use" }), " ", "and", " ", _jsx(Link, { href: "/privacy-policy", className: "text-primary text-xs lg:text-sm hover:underline md:h-20", children: "Privacy Policy" }), "."] }) }))] }));
}
export function TermsAndServicesFooter({ companyName }) {
    const { setIsArtifactViewOpen } = useStore();
    return (_jsx(_Fragment, { children: _jsxs("p", { className: "text-xs lg:text-sm font-normal text-center text-[#27272A] 2xl:mt-10 lg:mt-4", children: ["By interacting with ", companyName, " you agree to the", " ", _jsx(Link, { href: "/terms-of-use", className: "text-primary text-xs lg:text-sm hover:underline", children: "Terms of Use" }), " ", "and", " ", _jsx(Link, { href: "/privacy-policy", className: "text-primary text-xs lg:text-sm hover:underline md:h-20", children: "Privacy Policy" }), "."] }) }));
}
//# sourceMappingURL=emptyChatView.js.map