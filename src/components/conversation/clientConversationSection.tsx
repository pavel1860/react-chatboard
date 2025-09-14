import { Switch, User } from "@heroui/react";
import { ConversationType, useConversationList, useConversation, useCreateConversation } from "../../services/conversationService"
import { Listbox, ListboxItem } from "@heroui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCtx } from "../../providers/ctx-provider";
import { useConversationRouter } from "../../hooks/conversation-hook";
import { Bot, User as UserIcon } from "lucide-react";
import { useUpdateUser } from "../../services/userService";
import { useEffect, useState } from "react";




const AutoRespondSwitch = ({conversation, refresh}: {conversation: ConversationType, refresh: () => void}) => {
    const clientUser = conversation.participants.find((participant: any) => participant.role === "client")

    const [isSelected, setIsSelected] = useState(clientUser?.autoRespond === "auto")
    console.log(">>>", clientUser)

    const {trigger: updateUser} = useUpdateUser(clientUser && {id: clientUser.id})


    // useEffect(()=>{
    //     const clientUser = conversation.participants.find((participant: any) => participant.role === "client")
    //     if (clientUser) {
    //         setIsSelected(clientUser.autoRespond === "auto")
    //     } else {
    //         setIsSelected(false)
    //     }
    // }, [conversation])

    return (
        <div onClick={(e) => e.stopPropagation()}>
        <Switch
            isSelected={isSelected}
            color="success"
            endContent={<UserIcon />}
            size="sm"
            startContent={<Bot />}
            onValueChange={async (value) => {
                // if (!clientUser) {
                //     return
                // }
                setIsSelected(value)
                // await updateUser({
                //     auto_respond: value ? "auto" : "approve"
                // })
                // refresh()
            }}
        />
        </div>
    )
}



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
    } = useConversationList({
        limit: 10, 
        offset: 0, 
        filters: [["platform", "==", "whatsapp"]]
    })
    const { trigger: createConversation, isMutating } = useCreateConversation();

    const { goToConversation } = useConversationRouter();


    // if (isLoading) {
    //     return <Spinner />
    // }
    return (
        <div className="w-full flex flex-col items-start justify-start gap-4">
            <div className="flex flex-row items-center justify-start px-2 pt-2 gap-6 w-full">
                {/* <Icon
                    icon="solar:dialog-2-linear"
                    width={24}
                    height={24}
                    className="text-[#18181B]"
                /> */}
                <span className="font-typography-base-primary font-semibold text-base leading-6 text-[#18181B]">
                    Whatsapp Conversations
                </span>
            </div>
            {conversations && status === "authenticated" && (
                <Listbox
                    selectionMode="none"
                    selectionBehavior="replace"
                    selectedKeys={partitionId ? [partitionId] : []}
                >
                {conversations?.map((conv: ConversationType) => {
                    const clientUser = conv.participants?.[0]
                    const turn = conv.turns?.[0]
                    let lastMessageContent = conv.name
                    if (turn){
                        const lastMessage = turn.messages?.[0]
                        if (lastMessage){
                            lastMessageContent = lastMessage.content
                        }
                    }
                    
                    return (
                        <ListboxItem 
                            key={conv.id} 
                            className="w-full"
                            onPress={() => goToConversation(conv.id)}
                            // startContent={<div onClick={(e) => e.stopPropagation()}><AutoRespondSwitch conversation={conv} refresh={mutate} /></div>}                        
                            
                        >
                            {/* <AutoRespondSwitch conversation={conv} refresh={mutate} /> */}
                            {/* <h2 className={`text-lg ${partitionId === conv.id ? "font-medium" : "font-light text-default-500"}`}>{conv.name}</h2> */}
                            <div className="flex flex-row items-center justify-between w-full">
                                <User
                                    name={clientUser?.name || "Unknown"}
                                    description={lastMessageContent}
                                    avatarProps={{
                                        src: clientUser?.image,
                                    }}
                                />
                                <AutoRespondSwitch conversation={conv} refresh={mutate} />
                            </div>
                        </ListboxItem>
                    )
                })}
                </Listbox>
                
            )}
        </div>
    )
}