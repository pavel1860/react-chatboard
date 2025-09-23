import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@heroui/react";
import { LayoutHeader } from "./conversationLayout";
import { useLayout } from "../../hooks/layout-hook";
import { Icon } from "@iconify-icon/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useStore } from "../../store/useStore";
export const MarketPlaceHeader = () => {
    const { setIsSidebarOpen } = useLayout();
    const { data: session, status } = useSession();
    const { onAuthOpenChange } = useStore();
    const handleSignUp = () => {
        onAuthOpenChange(true);
    };
    const isAuthenticated = status === "authenticated";
    return (_jsx(LayoutHeader, { startContent: _jsx(_Fragment, { children: isAuthenticated ? (_jsx(Button, { onPress: () => setIsSidebarOpen(true), className: "px-2 lg:hidden", variant: "light", isIconOnly: true, children: _jsx(Icon, { icon: "solar:siderbar-linear", width: 24, height: 24 }) })) : (_jsxs(_Fragment, { children: [_jsx(Image, { src: "/Logo.svg", alt: "Logo", width: 66.16, height: 28, className: "hidden sm:block ml-2" }), _jsx(Image, { src: "/Icon.svg", alt: "Logo", width: 40, height: 40, className: " sm:hidden ml-2" })] })) }), endContent: isAuthenticated ? (_jsx(_Fragment, {})) : (_jsx(Button, { variant: "solid", color: "primary", size: "md", radius: "md", className: "h-[36px]", onPress: handleSignUp, children: "Sign Up" })), children: _jsx("div", { className: "flex flex-row items-center justify-center gap-2 w-fit px-3", children: _jsxs("span", { className: "flex flex-row items-center justify-left gap-2 font-medium", children: [_jsx(Icon, { icon: "mdi:home-search-outline", width: 24, height: 24, color: "blue", className: "bg-primary-50 rounded-full w-[40px] h-[40px] p-1" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-extrabold text-default-500 text-md", children: "Marketplace" }), _jsx("span", { className: "text-default-500 text-[10px] md:text-xs", children: "Search Properties" })] })] }) }) }));
};
//# sourceMappingURL=headers.js.map