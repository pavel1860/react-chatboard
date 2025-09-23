import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@heroui/react";
import { useSession, signIn, signOut } from "next-auth/react";
export default function LoginBtn({ className, size = "md", variant = "solid", color = "default" }) {
    const { data: session } = useSession();
    if (session) {
        return (_jsxs("div", { className: `flex flex-row gap-2 items-center ${className}`, children: ["Signed in as ", session.user?.email, " ", _jsx("br", {}), _jsx(Button, { onPress: () => signOut(), size: size, variant: variant, color: color, children: "Sign out" })] }));
    }
    return (_jsxs("div", { className: `flex flex-row gap-2 items-center ${className}`, children: ["Not signed in ", _jsx("br", {}), _jsx(Button, { onPress: () => signIn(), size: size, variant: variant, color: color, children: "Sign in" })] }));
}
//# sourceMappingURL=login-button.js.map