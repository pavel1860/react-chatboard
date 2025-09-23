"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { signIn, signOut, useSession } from "next-auth/react";
export default function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (_jsxs(_Fragment, { children: [session?.user?.name, " ", _jsx("br", {}), _jsx("button", { onClick: () => signOut(), children: "Sign out" })] }));
    }
    return (_jsxs(_Fragment, { children: ["Not signed in ", _jsx("br", {}), _jsx("button", { onClick: () => signIn(), children: "Sign in" })] }));
}
//# sourceMappingURL=auth.js.map