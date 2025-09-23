import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { useStore } from "../../store/useStore";
import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs, User, } from "@heroui/react";
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
    const getUserFirstName = (username) => {
        const firstName = username ? username.split(" ")[0] : "";
        return firstName;
    };
    return (_jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: _jsx("div", { className: "flex flex-row gap-2 items-center", children: _jsxs(Dropdown, { children: [_jsx(DropdownTrigger, { children: _jsx("div", { className: "flex flex-row items-center justify-center", children: _jsx(User, { name: session?.user?.name, description: session?.user?.email, avatarProps: {
                                    src: session?.user?.picture,
                                    name: getUserFirstName(session?.user?.name),
                                } }) }) }), _jsxs(DropdownMenu, { "aria-label": "Static Actions", variant: "flat", disabledKeys: ["divider"], children: [_jsx(DropdownItem, { variant: "flat", textValue: "Settings", children: "Settings" }, "settings"), _jsx(DropdownItem, { variant: "flat", textValue: "Divider", children: _jsx(Divider, {}) }, "divider"), _jsx(DropdownItem, { onPress: handleLogout, variant: "flat", textValue: "Log out", children: "Log out" }, "logout")] })] }) }) }));
}
function SidebarWrapper({ children }) {
    return (_jsx("div", { className: "flex flex-col w-full h-full pt-10 bg-[#F4F4F5]", children: children }));
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
    const { partitionId } = useCtx();
    const handleLogout = () => {
        signOut();
    };
    const getUserFirstName = (username) => {
        const firstName = username ? username.split(" ")[0] : "";
        return firstName;
    };
    const { goToNewConversation } = useConversationRouter();
    // const { currUser } = useCurrUser()
    const loggedInUserIcon = isAuthenticated ? (_jsx("div", { children: _jsx(Avatar, { src: session?.user?.picture, name: getUserFirstName(session?.user?.name), size: "lg", className: "w-10 h-10 text-large" }) })) : (_jsx("div", {}));
    if (status === "unauthenticated") {
        return (_jsx(SidebarWrapper, { children: _jsxs("div", { className: "px-4 py-10 w-full flex flex-col items-center justify-center gap-4", children: [_jsx("p", { className: "font-typography-base-primary font-medium text-base leading-6 text-[#18181B] text-center", children: "Your chats will appear here. Sign up to save them." }), _jsx(Button, { className: "h-10 bg-[#413BF7] rounded-xl font-typography-base-primary font-normal text-sm leading-[150%] text-white", onPress: handleSignUp, children: "Sign up or Login" })] }) }));
    }
    return (
    // <div className="flex flex-col w-full h-full pt-10 bg-[#F4F4F5]">
    _jsxs(SidebarWrapper, { children: [_jsxs(Tabs, { isVertical: true, variant: "light", defaultSelectedKey: "assistant", color: "primary", 
                // className="bg-red-500" 
                size: "lg", classNames: {
                    tabList: "p-0 h-full rounded-none border-r-1 border-r-gray-200",
                    panel: "p-0 w-full",
                    tab: "h-12 pt-2",
                    tabWrapper: "flex-grow"
                }, children: [session?.user?.is_admin && _jsx(Tab, { title: _jsx(Icon, { icon: "material-symbols:terminal", width: 24, height: 24 }), href: partitionId ? `/admin/user/${session?.user?.id}/conversation/${partitionId}` : `/admin/user/${session?.user?.id}` }, "admin"), _jsx(Tab, { title: _jsx(Icon, { icon: "lucide:brain-circuit", width: 24, height: 24 }), children: _jsxs("div", { className: "w-full flex flex-col gap-2", children: [_jsx("div", { className: "flex flex-row items-center justify-center gap-4 w-full", children: _jsx(Button, { variant: "flat", size: "md", radius: "lg", className: "min-w-10 px-12 h-[50px] bg-[#807CFA]", onPress: goToNewConversation, startContent: _jsx(Icon, { icon: "solar:pen-new-square-linear", width: 24, height: 24, className: "text-white" }), children: _jsx("span", { className: "font-typography-base-primary font-semibold text-base leading-6 text-[#F4F4F5]", children: "New chat" }) }) }), _jsx(ConversationSection, {})] }) }, "assistant"), _jsx(Tab, { title: _jsx(Icon, { icon: "bi:whatsapp", width: 24, height: 24 }), children: _jsx(ClientConversationSection, {}) }, "whatsapp")] }), _jsx("footer", { className: "h-16", children: _jsx(UserMenu, {}) })] }));
}
export default SidebarDrawer;
//# sourceMappingURL=SidebarDrawer.js.map