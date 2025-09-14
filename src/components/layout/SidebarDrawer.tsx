import { useStore } from "../../store/useStore";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Tab,
  Tabs,
  User,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ConversationSection from "../../components/conversation/conversationSection";
import { signOut, useSession } from "next-auth/react";
import { useCtx } from "../../providers/ctx-provider";
import { useConversationRouter } from "../../hooks/conversation-hook";
import ClientConversationSection from "../../components/conversation/clientConversationSection";




function UserMenu() {
  const { data: session, status } = useSession({
    required: false,
  });

  const handleLogout = () => {
    signOut();
  };

  const getUserFirstName = (username?: string) => {
    const firstName = username ? username.split(" ")[0] : "";
    return firstName;
  };

  return (
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

  )
}


function SidebarWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full h-full pt-10 bg-[#F4F4F5]">
      {children}
    </div>
  )
}



function SidebarDrawer() {
  const { onAuthOpenChange, isSidebarOpen, setIsSidebarOpen, setBranchId } = useStore();
  const handleSignUp = () => {
    setIsSidebarOpen(false);
    onAuthOpenChange(true);
  };

  const { data: session, status } = useSession({
    required: false,
  });
  const isAuthenticated = status === "authenticated";

  const { partitionId } = useCtx()

  const handleLogout = () => {
    signOut();
  };

  const getUserFirstName = (username?: string) => {
    const firstName = username ? username.split(" ")[0] : "";
    return firstName;
  };

  const { goToNewConversation } = useConversationRouter();
  

  // const { currUser } = useCurrUser()


  
  

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

  if (status === "unauthenticated") {

    return (
      <SidebarWrapper>
        <div className="px-4 py-10 w-full flex flex-col items-center justify-center gap-4">
          <p className="font-typography-base-primary font-medium text-base leading-6 text-[#18181B] text-center">
            Your chats will appear here. Sign up to save them.
          </p>
          <Button
            className="h-10 bg-[#413BF7] rounded-xl font-typography-base-primary font-normal text-sm leading-[150%] text-white"
            onPress={handleSignUp}
          >
            Sign up or Login
          </Button>
        </div>
      </SidebarWrapper>
    )

  }


  return (
    // <div className="flex flex-col w-full h-full pt-10 bg-[#F4F4F5]">
    <SidebarWrapper>
      
      <Tabs 
        isVertical 
        variant="light" 
        defaultSelectedKey={"assistant"}
        color="primary"
        // className="bg-red-500" 
        size="lg" 
        classNames={{
          tabList: "p-0 h-full rounded-none border-r-1 border-r-gray-200",
          panel: "p-0 w-full",
          tab: "h-12 pt-2",
          tabWrapper: "flex-grow"
        }}
        
        >
          {session?.user?.is_admin && <Tab 
            key="admin"
            title={<Icon icon="material-symbols:terminal" width={24} height={24} />}
            href={partitionId ? `/admin/user/${session?.user?.id}/conversation/${partitionId}` : `/admin/user/${session?.user?.id}`}
          />}
        <Tab key="assistant" title={<Icon icon="lucide:brain-circuit" width={24} height={24} />}>
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row items-center justify-center gap-4 w-full">
                <Button
                  variant="flat"
                  size="md"
                  radius="lg"
                  className="min-w-10 px-12 h-[50px] bg-[#807CFA]"
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
              </div>
          <ConversationSection />
          </div>
        </Tab>
        <Tab key="whatsapp" title={<Icon icon="bi:whatsapp" width={24} height={24} />}>
          <ClientConversationSection />
        </Tab>        
      </Tabs>
      <footer className="h-16">
        <UserMenu />
      </footer>
      </SidebarWrapper>

  )

}

export default SidebarDrawer;
