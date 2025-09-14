// import { ArtifactCtxType, MessageType, useChat } from "@/providers/chat-provider";
// import AvatarChoices from "./choices/avatarChoices";
// import { ToolCall } from "react-chatboard/src/chat/chat-context";
import { useEffect, useRef, useState } from "react";
import { cn, Spinner } from "@heroui/react";
// import EmptyChatView from "@/components/chat/emptyChatView";
import { useCreateConversation } from "../../services/conversationService";
import { Button, Divider, Link } from "@heroui/react";
import { ChatInput } from "../../components/editor/input";
import { useCallback } from "react";
import { useStore } from "../../store/useStore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "../../providers/ctx-provider";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify-icon/react";
import { MessageType } from "../../services/turnService";





const EmptyMessage = ({texts}: {texts: string[]}) => {
    return (
        <div className="flex flex-col items-start justify-center bg-default-100 rounded-2xl py-2 px-4 shadow-sm">
            {texts.map((text, index) => (
                <p key={index} className="text-center">{text}</p>
            ))}
        </div>
    )
}





function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Skip if `window` is not available (i.e. during SSR)
    if (typeof window === 'undefined') return;

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



interface EmptyChatViewProps {
  backgroundImage?: string;
  title?: string[];
  messages?: string[][];
  companyName?: string;
  hideTermsAndServices?: boolean;
}


export default function EmptyChatView({ backgroundImage, title, messages, companyName, hideTermsAndServices }: EmptyChatViewProps) {
  const { setPendingMessage, setArtifactView } = useStore();
  const { trigger: createConversation } = useCreateConversation();
  const router = useRouter();
  const { branchId, setBranchId, setConversationId } = useCtx();

  const { onAuthOpenChange, isArtifactViewOpen, setIsArtifactViewOpen } = useStore();
  const [imageOffset, setImageOffset] = useState(0);

  const { data: session, status } = useSession({
    required: false,
  })

  const headingRef = useRef<HTMLDivElement>(null);

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
  const createConversationAndSend = useCallback(
    async (
      name: string,
      avatar: string | null,
      pendingMessage: MessageType
    ) => {
      
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
    },
    []
  );

  return (
    <div className={cn(
      "flex flex-col justify-center items-center gap-10 w-full h-full relative", 
      
      )}>
      
      <AnimatePresence initial={false} mode="wait">
      {!isArtifactViewOpen && backgroundImage &&
      <motion.div className={cn(
        "absolute inset-0 w-full h-full",
        "bg-gradient-to-b from-[rgba(113,113,122,0.6)] to-white",
        )}
        initial={{ opacity: 1 }}
        animate={{ opacity: isArtifactViewOpen ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Image
            src={backgroundImage}
            alt="Ziggi background"            
            className="object-cover"
            fill          
          />
        </motion.div>
        }
        </AnimatePresence>
      <main className="h-full w-full flex flex-col justify-center items-center gap-3 relative">

      
      <div className="flex flex-col items-center justify-center max-w-5xl mt-6">
        <h1
          ref={headingRef}
          // className="text-center text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-extrabold text-[#18181B] flex-grow"
          className="text-center"
        >
          {title?.map((text, index) => (
            <div key={index} className="text-default-700 text-6xl sm:text-6xl lg:text-5xl xl:text-7xl 2xl:text-8xl font-bold">
              {text}
            </div>
          ))}
        </h1>
      </div>
      <div>
        {/* <p className="text-xl text-center font-medium  2xl:text-2xl lg:text-xl text-default-500 p-4">
            Choose an <span className="font-bold">Avatar</span> to chat with, that will <span className="font-bold">guide</span> you through your
            journey.
          </p>           */}

        {/* <AvatarChoices
          message={defaultMessage}
          sendMessage={(
            content: string,
            toolCalls: ToolCall[],
            state?: any,
            fromMessageId?: string | null,
            sessionId?: string | null,
            files?: any
          ) => {
            createConversationAndSend(content, toolCalls[0].tool.avatar, {
              content: content,
              choices: null,
              role: "user",
              id: 1,
              branchId: 1,
              turnId: 1,
              toolCalls: toolCalls,
              runId: null,
            });
          }}
        /> */}
      </div>
      {/* <p className="text-xl text-center font-medium  2xl:text-2xl lg:text-xl text-default-500">
        Chat with us to find out more!
      </p> */}
      <div className="flex flex-col items-start justify-center gap-2 w-full max-w-3xl z-10 p-2">
        {messages?.map((message, index) => (
          <EmptyMessage key={index} texts={message} />
        ))}
      </div>
      <div
        // className="flex md:flex-row item-center w-full justify-center 2xl:px-14 px-4 lg:mx-auto lg:w-[63%]"
        className="w-full flex justify-center px-2 max-w-3xl"
      >
        <ChatInput
          bgColor="#FAFAFA"
          borderColor="#E0E0E0"
          // width={"100%"}
          rows={1}
          placeholder="What are you looking for today?"
          // onKeyPress={sendMessage}
          onSubmit={(text: string) => {
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
          }}
        />
      </div>
      {/* {!isArtifactViewOpen && <div className="hidden w-[60%] mx-auto md:flex items-center gap-1 lg:mb-2 2xl:my-3">
        <Divider className="flex-1" />
        <span className="text-gray-500">or</span>
        <Divider className="flex-1" />
      </div>} */}
      {/* {!isArtifactViewOpen && <div className="hidden md:flex justify-center bg-default-100 rounded-full py-2 px-4">
        <Link
          // href="/landing"
          className="text-primary hover:cursor-pointer hover:underline"
          showAnchorIcon
          anchorIcon={
            <Icon icon="mdi:home-search-outline" width={20} height={20} />
          }
          onPress={() => setIsArtifactViewOpen(true)}
        >
          {" "}
          Or go to the Marketplace
        </Link>
      </div>} */}
      </main>
      {!hideTermsAndServices && (
      <footer className="w-full bg-white z-50">
        <p className="text-xs lg:text-sm font-normal text-center text-[#27272A] 2xl:mt-4 lg:mt-4">
          By interacting with {companyName} you agree to the{" "}
          <Link
            href="/terms-of-use"
            className="text-primary text-xs lg:text-sm hover:underline"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-primary text-xs lg:text-sm hover:underline md:h-20"
          >
            Privacy Policy
          </Link>
          .
          </p>
        </footer>
      )}
    </div>
  );
}







export function TermsAndServicesFooter({ companyName }: { companyName: string }) {

  const { setIsArtifactViewOpen } = useStore();

  return (
    <>
    <p className="text-xs lg:text-sm font-normal text-center text-[#27272A] 2xl:mt-10 lg:mt-4">
        By interacting with {companyName} you agree to the{" "}
        <Link
          href="/terms-of-use"
          className="text-primary text-xs lg:text-sm hover:underline"
        >
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-primary text-xs lg:text-sm hover:underline md:h-20"
        >
          Privacy Policy
        </Link>
        .
      </p>
      </>
  )
}