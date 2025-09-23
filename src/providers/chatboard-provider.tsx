import { ReactNode, useEffect } from "react";
import { RegistryProps, UserComponentProvider } from "../components/blocks/UserComponentRegistry"
import { ChatProvider } from "./chat-provider"
import { CtxProvider } from "./ctx-provider"
import Layout from "../components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";
import { Button } from "@heroui/react";


interface ChatboardProviderProps {
    Component: React.ComponentType<any> & {
        header?: ReactNode;
        layoutProps?: {
            hideFooter?: boolean;
            noneArtifact?: boolean;
        };
    };
    registry: RegistryProps;
    children: React.ReactNode;
    extra?: ReactNode;
    session: any;
}



export const ChatboardProvider = ({Component, children, registry, extra, session}: ChatboardProviderProps) => {

    useEffect(() => {
        console.log("registry", registry)
    }, [registry])
    
    return (
        <SessionProvider
          session={session}
          refetchInterval={0}
          refetchOnWindowFocus={false}
          refetchWhenOffline={false}
        >
            <CookiesProvider>
                <CtxProvider>
                    <ChatProvider>
                        <UserComponentProvider registry={registry} >
                            {/* <Layout
                                extra={extra}
                                header={Component.header}
                                layoutProps={Component.layoutProps}
                                > */}                                
                                {children}
                            {/* </Layout> */}
                        </UserComponentProvider>
                    </ChatProvider>
                </CtxProvider>
            </CookiesProvider>
        </SessionProvider>
    )
}