import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SidebarDrawer from "./SidebarDrawer";
import { useSession } from "next-auth/react";
import AdminSideBarDrawer from "./AdminSideBarDrawer";
import { AdminConversationLayout, ConversationLayout, } from "../conversation/conversationLayout";
import { usePathname } from "next/navigation";
import { cn } from "@heroui/react";
import { useCtx } from "../../providers/ctx-provider";
const Layout = ({ children, className = "", header, layoutProps, extra, }) => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const { partitionId } = useCtx();
    // @ts-ignore
    const isAdminMode = session?.user?.is_admin && pathname?.includes("/admin");
    if (layoutProps?.noneArtifact) {
        return (_jsxs("div", { className: cn("lg:flex lg:min-h-screen", className), children: [extra, _jsx("div", { className: "hidden lg:block w-14 h-full", children: isAdminMode ? _jsx(AdminSideBarDrawer, {}) : _jsx(SidebarDrawer, {}) }), _jsx("div", { className: "h-full w-14 lg:hidden" }), _jsx("main", { className: "flex-1 h-full", children: children })] }));
    }
    if (isAdminMode) {
        return (_jsx(AdminConversationLayout, { extra: extra, sidebar: _jsx(AdminSideBarDrawer, {}), 
            // @ts-ignore
            header: header && header(), hideFooter: layoutProps?.hideFooter || !partitionId, children: children }));
    }
    else {
        return (_jsx(ConversationLayout, { extra: _jsx("div", { children: extra }), sidebar: _jsx(SidebarDrawer, {}), 
            // header={header ? (typeof header === "function" ? header() : header) :null}
            // @ts-ignore
            header: header && header(), 
            // header={header}
            hideFooter: layoutProps?.hideFooter || !partitionId, children: children }));
    }
};
export default Layout;
//# sourceMappingURL=Layout.js.map