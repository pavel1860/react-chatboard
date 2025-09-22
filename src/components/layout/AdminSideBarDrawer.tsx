import { useStore } from "../../store/useStore";
import {
    Avatar,
    Button,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    User,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ConversationSection from "../conversation/conversationSection";
import { signOut, useSession } from "next-auth/react";
import UserSection from "../conversation/userSection";
import { useAdminCtx } from "../../providers/ctx-provider";
import { useConversationRouter } from "../../hooks/conversation-hook";


function SidebarDrawer() {
    const { onAuthOpenChange, isSidebarOpen, setIsSidebarOpen, setBranchId } = useStore();
    const handleSignUp = () => {
        setIsSidebarOpen(false);
        onAuthOpenChange(true);
    };

    const { data: session, status } = useSession({
        required: false,
    });

    const { goToNewConversation } = useConversationRouter();


    const {
        refUserId,
        setRefUserId,
        isUserListOpen,
        setIsUserListOpen,
    } = useAdminCtx()
    const isAuthenticated = status === "authenticated";

    const handleLogout = () => {
        signOut();
    };

    const getUserFirstName = (username?: string) => {
        const firstName = username ? username.split(" ")[0] : "";
        return firstName;
    };

    const loggedInUserIcon = isAuthenticated ? (
        <div>
            <Avatar
                src={session?.user?.picture}
                name={getUserFirstName(session?.user?.name)}
                size="lg"
                className="w-10 h-10 text-large"
            />
        </div>
    ) : (
        <div></div>
    );

    if (!refUserId) {
        return <div>Loading...</div>
    }

    return (
        <>
            {/* Custom Fixed Drawer */}
            <div 
                className={`h-full w-full bg-[#F4F4F5] z-40 pt-6`}
            >
                {/* Drawer Header */}
                <div className="flex flex-col gap-1 p-0">                    
                    <h3 className="text-center text-lg font-bold text-blue-600">
                        Admin Panel
                    </h3>
                </div>

                {/* Drawer Body */}
                <div className="py-6 px-4">
                    <div className="flex flex-col items-center gap-6 w-full">
                        <div className="flex flex-row items-center justify-start gap-2 w-full">
                            {!isUserListOpen && <Button 
                                variant="light" 
                                onPress={() => setIsUserListOpen(true)}
                                startContent={<Icon icon="solar:arrow-left-line-duotone" height={20} width={20} />}
                            >
                                Back to users                
                            </Button>}
                        </div>
                        {!isUserListOpen && <div className="flex flex-row items-center justify-center gap-4 w-full">
                            <Button
                                variant="flat"
                                size="md"
                                radius="lg"
                                className="min-w-10 px-4 h-[50px] bg-[#807CFA]"
                                onPress={goToNewConversation}
                                startContent={
                                    <Icon
                                        icon="solar:pen-new-square-linear"
                                        width={24}
                                        height={24}
                                        className="text-white"
                                    />
                                }
                            >
                                <span className="font-typography-base-primary font-semibold text-base leading-6 text-[#F4F4F5]">
                                    New chat
                                </span>
                            </Button>
                        </div>}
                        {status === "unauthenticated" && (
                            <div className="flex flex-col items-center gap-4 w-[216px]">
                                <p className="font-typography-base-primary font-medium text-base leading-6 text-[#18181B] text-center">
                                    Your chats will appear here. Sign up to save them.
                                </p>
                                <Button
                                    className="w-full h-10 bg-[#413BF7] rounded-xl font-typography-base-primary font-normal text-sm leading-[150%] text-white"
                                    onPress={handleSignUp}
                                >
                                    Sign up or Login
                                </Button>
                            </div>
                        )}
                        {status === "authenticated" && (
                            isUserListOpen ? <UserSection /> : <ConversationSection />                                
                        )}
                    </div>
                </div>

                {/* Drawer Footer */}
                {isAuthenticated && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex flex-row gap-2 items-center">
                            <Dropdown>
                                <DropdownTrigger>
                                    <div className="flex flex-row items-center justify-center">
                                        <User
                                            name={session?.user?.name}
                                            description={session?.user?.email}
                                            avatarProps={{
                                                src: session?.user?.picture,
                                                name: getUserFirstName(session?.user?.name),
                                            }}
                                        />
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Static Actions"
                                    variant="flat"
                                    disabledKeys={["divider"]}
                                >
                                    <DropdownItem
                                        key="settings"
                                        variant="flat"
                                        textValue="Settings"
                                    >
                                        Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        key="divider"
                                        variant="flat"
                                        textValue="Divider"
                                    >
                                        <Divider />
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        onPress={handleLogout}
                                        variant="flat"
                                        textValue="Log out"
                                    >
                                        Log out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SidebarDrawer;
