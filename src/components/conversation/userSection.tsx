import { Spinner, Switch } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Listbox, ListboxItem } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useCreateUser, UserType, useUserList } from "../../services/userService";
import { useAdminCtx, useCtx } from "../../providers/ctx-provider";
import ConversationSection from "./conversationSection";
import { User } from "lucide-react";



export default function UserSection() {

    // const { conversationId, setConversationId } = useStore()

    const { data: session, status } = useSession({
        required: false,
    })

    

    const {
        refUserId,
        setRefUserId,        
        isUserListOpen,
        setIsUserListOpen,
        setBranchId,
    } = useAdminCtx()




    // const { data: users, isLoading, mutate } = useUserList(10, 0)
    const { data: users, isLoading, mutate } = useUserList({
        limit: 10, 
        offset: 0, 
        // filters: session?.user?.id && [["authUserId", "!=", session?.user?.id]]
    })
    
    const { trigger: createUser, isMutating } = useCreateUser();



    // const router = useRouter()

    if (isLoading) {
        return <Spinner />
    }


    return (
        <div className="w-full flex flex-col items-start justify-start gap-4">

            <div className="w-full flex items-center justify-start">
                
            </div>
            <div className="flex flex-row items-center justify-start px-2 pt-2 gap-6 w-full">
                <Icon
                    icon="solar:users-group-rounded-broken"
                    width={24}
                    height={24}
                    className="text-[#18181B]"
                />
                <span className="font-typography-base-primary font-semibold text-base leading-6 text-[#18181B]">
                    System Users
                </span>
            </div>
            {users && status === "authenticated" && (
                <Listbox
                    selectionMode="single"
                    selectedKeys={refUserId ? [refUserId] : []}
                >
                {users?.flat().map((user: UserType) => (
                    <ListboxItem 
                        key={user.id} 
                        // href={`/admin/user/${user.id}`} 
                        // startContent={user.email === session?.user?.email && <Chip className="text-xs text-default-500">You</Chip>}                        
                        // startContent={<div>
                        //     <Switch
                        //         defaultSelected
                        //         color="success"
                        //         endContent={<Bot />}
                        //         size="lg"
                        //         startContent={<User />}
                        //         >
                        //         Auto Respond
                        //         </Switch>

                        // </div>}
                        onPress={() => {
                            if (refUserId !== user.id) {
                                setBranchId(1)
                                setRefUserId(user.id)                                
                                // router.push(`/admin/user/${user.id}`)
                            }
                            setIsUserListOpen(false)
                        }}   
                        // endContent={
                        //     refUserId === user.id && <Button isIconOnly variant="light" onPress={() => {
                        //     setRefUserId(null)
                        //     router.push(`/`)
                        //     }
                        // }                                             
                        // >
                        // <Icon icon="solar:close-circle-linear" height={20} width={20} />
                        //     </Button>}
                    >    
                        <h2 className={`text-lg ${refUserId === user.id ? "font-medium" : "font-light text-default-500"}`}>{user.name || `Anonymous ${user.id}`}</h2>                                                
                    </ListboxItem>
                    ))}
                </Listbox>
            )}
                
        </div>
    )
}