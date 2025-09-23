"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCtx } from "../../providers/ctx-provider";
import { Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { signIn, signOut, useSession } from "next-auth/react";
const GoogleLogin = () => {
    const { status } = useSession();
    const { partitionId } = useCtx();
    let redirectUrl = "/api/promote-redirect";
    if (partitionId) {
        redirectUrl += "?partitionId=" + partitionId;
    }
    const handleLogin = () => {
        localStorage.setItem("login_attempt", "true");
        signIn("google", {
            // callbackUrl: window.location.href,
            callbackUrl: redirectUrl,
            redirect: true,
        });
    };
    const handleLogout = () => {
        signOut({ callbackUrl: window.location.href });
    };
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    if (isLoading) {
        return (_jsx(Button, { disabled: true, className: "w-full h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 font-medium", children: "Loading..." }));
    }
    return isAuthenticated ? (
    // <div></div>
    _jsx(Button, { onPress: handleLogout, className: "w-full h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-medium", children: "Log out" })) : (_jsxs(Button, { onPress: handleLogin, className: "w-full h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-medium gap-2", children: [_jsx(Icon, { icon: "logos:google-icon", width: 20, height: 20 }), "Continue with Google"] }));
};
export default GoogleLogin;
//# sourceMappingURL=GoogleLogin.js.map