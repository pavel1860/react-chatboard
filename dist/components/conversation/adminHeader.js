import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Chip, Avatar } from "@heroui/react";
import { LayoutHeader } from "./conversationLayout";
import { useLayout } from "../../hooks/layout-hook";
import { Icon } from "@iconify-icon/react";
import { useCtx } from "../../providers/ctx-provider";
import { useUser } from "../../services/userService";
export const AdminMarketPlaceHeader = ({ children, refBranchId }) => {
    const { partitionId, setConversationId, branchId, setBranchId, refUserId } = useCtx();
    const { data: refUser } = useUser({ id: refUserId });
    const currBranchId = refBranchId || branchId;
    const { setIsSidebarOpen } = useLayout();
    return (_jsx(LayoutHeader, { startContent: _jsx(Button, { onPress: () => setIsSidebarOpen(true), className: "px-2 lg:hidden", variant: "light", isIconOnly: true, children: _jsx(Icon, { icon: "solar:siderbar-linear", width: 24, height: 24 }) }), children: _jsxs("span", { className: "flex flex-row items-center justify-between gap-2 w-full", children: [_jsxs("div", { className: "flex flex-row items-center gap-2", children: [refUser && _jsxs("div", { className: "flex flex-row items-center gap-2", children: [_jsx(Avatar
                                // @ts-ignore
                                , { 
                                    // @ts-ignore
                                    src: refUser?.image, name: refUser?.name || "Anonymous", size: "sm" }), refUser?.name || "Anonymous"] }), _jsxs(Chip, { variant: "bordered", color: "secondary", startContent: _jsx(Icon, { icon: "pajamas:branch", width: 16, height: 16 }), children: ["Branch ", currBranchId] }), _jsxs(Chip, { variant: "bordered", color: "secondary", startContent: _jsx(Icon, { icon: "solar:chat-round-dots-linear", width: 16, height: 16 }), children: ["Partition ", partitionId] })] }), children, _jsxs("span", { className: "flex flex-row items-center gap-2", children: [_jsx(Icon, { icon: "solar:siderbar-line-duotone", width: 24, height: 24 }), "Side"] })] }) }));
};
//# sourceMappingURL=adminHeader.js.map