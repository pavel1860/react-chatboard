import { Spinner, Switch, User } from "@heroui/react";
import { ConversationType, useConversationList, useConversation, useCreateConversation } from "../../services/conversationService"
import { Listbox, ListboxItem } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useCtx } from "../../providers/ctx-provider";
import { useConversationRouter } from "../../hooks/conversation-hook";




export default function ConversationSection() {

    // const { conversationId, setConversationId } = useStore()

    const { data: session, status } = useSession({
        required: false,
    })

    const { partitionId } = useCtx()

    const { 
        items: conversations, 
        isLoading, mutate, 
        // trigger: triggerConversationList 
    } = useConversationList({limit: 10, offset: 0})
    const { trigger: createConversation, isMutating } = useCreateConversation();

    const { goToConversation } = useConversationRouter();


    if (isLoading) {
        return <Spinner />
    }
    return (
        <div className="w-full flex flex-col items-start justify-start gap-4">
            {/* <div className="w-full flex items-center justify-start">
                <NewConversationButton onPress={async () => {
                    router.push("/")
                }} isMutating={isMutating} isDisabled={status !== "authenticated"} />
            </div> */}
            <div className="flex flex-row items-center justify-start px-2 pt-2 gap-6 w-full">
                {/* <Icon
                    icon="solar:dialog-2-linear"
                    width={24}
                    height={24}
                    className="text-[#18181B]"
                /> */}
                <span className="font-typography-base-primary font-semibold text-base leading-6 text-[#18181B]">
                    Previous Chats
                </span>
            </div>
            {conversations && status === "authenticated" && (
                <Listbox
                    selectionMode="single"
                    selectedKeys={partitionId ? [partitionId] : []}
                    // onSelectionChange={(keys) => {
                    //     // setConversationId(Number(keys.currentKey))                        
                    //     goToConversation(Number(keys.currentKey))
                    // }}
            >
                {conversations?.map((conv: ConversationType) => (
                    <ListboxItem 
                        key={conv.id} 
                        className="w-full"
                        onPress={() => goToConversation(conv.id)}                        
                    >
                        <h2 className={`text-lg ${partitionId === conv.id ? "font-medium" : "font-light text-default-500"}`}>{conv.name}</h2>
                    </ListboxItem>
                    ))}
                </Listbox>
            )}
        </div>
    )
}