import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
import { useStore } from "../../store/useStore";
import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User, } from "@heroui/react";
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
    const { refUserId, setRefUserId, isUserListOpen, setIsUserListOpen, } = useAdminCtx();
    const isAuthenticated = status === "authenticated";
    const handleLogout = () => {
        signOut();
    };
    const getUserFirstName = (username) => {
        const firstName = username ? username.split(" ")[0] : "";
        return firstName;
    };
    const loggedInUserIcon = isAuthenticated ? (_jsx("div", { children: _jsx(Avatar, { src: session?.user?.picture, name: getUserFirstName(session?.user?.name), size: "lg", className: "w-10 h-10 text-large" }) })) : (_jsx("div", {}));
    if (!refUserId) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx(_Fragment, { children: _jsxs("div", { className: `h-full w-full bg-[#F4F4F5] z-40 pt-6`, children: [_jsx("div", { className: "flex flex-col gap-1 p-0", children: _jsx("h3", { className: "text-center text-lg font-bold text-blue-600", children: "Admin Panel" }) }), _jsx("div", { className: "py-6 px-4", children: _jsxs("div", { className: "flex flex-col items-center gap-6 w-full", children: [_jsx("div", { className: "flex flex-row items-center justify-start gap-2 w-full", children: !isUserListOpen && _jsx(Button, { variant: "light", onPress: () => setIsUserListOpen(true), startContent: _jsx(Icon, { icon: "solar:arrow-left-line-duotone", height: 20, width: 20 }), children: "Back to users" }) }), !isUserListOpen && _jsx("div", { className: "flex flex-row items-center justify-center gap-4 w-full", children: _jsx(Button, { variant: "flat", size: "md", radius: "lg", className: "min-w-10 px-4 h-[50px] bg-[#807CFA]", onPress: goToNewConversation, startContent: _jsx(Icon, { icon: "solar:pen-new-square-linear", width: 24, height: 24, className: "text-white" }), children: _jsx("span", { className: "font-typography-base-primary font-semibold text-base leading-6 text-[#F4F4F5]", children: "New chat" }) }) }), status === "unauthenticated" && (_jsxs("div", { className: "flex flex-col items-center gap-4 w-[216px]", children: [_jsx("p", { className: "font-typography-base-primary font-medium text-base leading-6 text-[#18181B] text-center", children: "Your chats will appear here. Sign up to save them." }), _jsx(Button, { className: "w-full h-10 bg-[#413BF7] rounded-xl font-typography-base-primary font-normal text-sm leading-[150%] text-white", onPress: handleSignUp, children: "Sign up or Login" })] })), status === "authenticated" && (isUserListOpen ? _jsx(UserSection, {}) : _jsx(ConversationSection, {}))] }) }), isAuthenticated && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: _jsx("div", { className: "flex flex-row gap-2 items-center", children: _jsxs(Dropdown, { children: [_jsx(DropdownTrigger, { children: _jsx("div", { className: "flex flex-row items-center justify-center", children: _jsx(User, { name: session?.user?.name, description: session?.user?.email, avatarProps: {
                                                src: session?.user?.picture,
                                                name: getUserFirstName(session?.user?.name),
                                            } }) }) }), _jsxs(DropdownMenu, { "aria-label": "Static Actions", variant: "flat", disabledKeys: ["divider"], children: [_jsx(DropdownItem, { variant: "flat", textValue: "Settings", children: "Settings" }, "settings"), _jsx(DropdownItem, { variant: "flat", textValue: "Divider", children: _jsx(Divider, {}) }, "divider"), _jsx(DropdownItem, { onPress: handleLogout, variant: "flat", textValue: "Log out", children: "Log out" }, "logout")] })] }) }) }))] }) }));
}
export default SidebarDrawer;
//# sourceMappingURL=AdminSideBarDrawer.js.map