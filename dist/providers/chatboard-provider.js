import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { UserComponentProvider } from "../components/blocks/UserComponentRegistry";
import { ChatProvider } from "./chat-provider";
import { CtxProvider } from "./ctx-provider";
import Layout from "../components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";
export const ChatboardProvider = ({ Component, children, registry, extra, session }) => {
    useEffect(() => {
        console.log("registry", registry);
    }, [registry]);
    return (_jsx(SessionProvider, { session: session, refetchInterval: 0, refetchOnWindowFocus: false, refetchWhenOffline: false, children: _jsx(CookiesProvider, { children: _jsx(CtxProvider, { children: _jsx(ChatProvider, { children: _jsx(UserComponentProvider, { registry: registry, children: _jsx(Layout, { extra: extra, header: Component.header, layoutProps: Component.layoutProps, children: children }) }) }) }) }) }));
};
//# sourceMappingURL=chatboard-provider.js.map